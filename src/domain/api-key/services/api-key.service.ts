import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  PrismaClient,
  ApiKeyStatus,
  WhitelistType,
  AuditAction,
} from '@prisma/client';
import { CreateApiKeyDto } from '../dto/create-api-key.dto';
import { UpdateApiKeyDto } from '../dto/update-api-key.dto';
import {
  ApiKeyResponseDto,
  CreateApiKeyResponseDto,
  ApiKeyListResponseDto,
} from '../dto/api-key-response.dto';
import { AuditService } from '../../../common/helpers/audit/services/audit.service';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { isIP } from 'net';

@Injectable()
export class ApiKeyService {
  private readonly logger = new Logger(ApiKeyService.name);

  constructor(
    private readonly prisma: PrismaClient,
    private readonly auditService: AuditService,
  ) {}

  async createApiKey(
    dto: CreateApiKeyDto,
    adminId: string,
  ): Promise<CreateApiKeyResponseDto> {
    const existingKey = await this.prisma.apiKey.findFirst({
      where: { name: dto.name },
    });

    if (existingKey) {
      throw new ConflictException('An API key with this name already exists');
    }

    const plainApiKey = this.generateApiKey();
    const keyHash = await argon2.hash(plainApiKey);

    if (dto.whitelistEntries) {
      for (const entry of dto.whitelistEntries) {
        this.validateWhitelistEntry(entry.type, entry.value);
      }
    }

    const apiKey = await this.prisma.$transaction(async (transaction) => {
      const createdKey = await transaction.apiKey.create({
        data: {
          name: dto.name,
          keyHash,
          description: dto.description,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
          createdById: adminId,
          whitelistEntries: dto.whitelistEntries
            ? {
                create: dto.whitelistEntries.map((entry) => ({
                  type: entry.type,
                  value: entry.value.toLowerCase(),
                })),
              }
            : undefined,
        },
        include: {
          whitelistEntries: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return createdKey;
    });

    this.logger.log(`API key created: ${dto.name} by admin ${adminId}`);

    // Log the API key creation in audit service
    await this.auditService.log({
      userId: adminId,
      userEmail: 'admin', // You might want to get the actual admin email
      action: AuditAction.API_KEY_CREATE,
      message: `Created API key: ${dto.name}`,
      method: 'POST',
      details: {
        apiKeyId: apiKey.id,
        apiKeyName: dto.name,
        description: dto.description,
        whitelistEntriesCount: dto.whitelistEntries?.length || 0,
      },
    });

    return {
      apiKey: plainApiKey,
      keyData: apiKey as unknown as ApiKeyResponseDto,
    };
  }

  async findAll(): Promise<ApiKeyListResponseDto> {
    const apiKeys = await this.prisma.apiKey.findMany({
      include: {
        whitelistEntries: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    const now = new Date();
    const apiKeysWithCorrectStatus = apiKeys.map((key) => {
      if (
        key.expiresAt &&
        key.expiresAt < now &&
        key.status === ApiKeyStatus.ACTIVE
      ) {
        return { ...key, status: ApiKeyStatus.EXPIRED };
      }
      return key;
    });

    return {
      data: apiKeysWithCorrectStatus as unknown as ApiKeyResponseDto[],
      totalCount: apiKeys.length,
    };
  }

  async findOne(id: string): Promise<ApiKeyResponseDto> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id },
      include: {
        whitelistEntries: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    return apiKey as unknown as ApiKeyResponseDto;
  }

  async updateApiKey(
    id: string,
    dto: UpdateApiKeyDto,
  ): Promise<ApiKeyResponseDto> {
    const existingKey = await this.prisma.apiKey.findUnique({
      where: { id },
      include: { whitelistEntries: true },
    });

    if (!existingKey) {
      throw new NotFoundException('API key not found');
    }

    if (existingKey.status === ApiKeyStatus.REVOKED) {
      throw new BadRequestException('Cannot update revoked API key');
    }
    if (dto.name && dto.name !== existingKey.name) {
      const duplicateKey = await this.prisma.apiKey.findFirst({
        where: {
          name: dto.name,
          id: { not: id },
        },
      });

      if (duplicateKey) {
        throw new ConflictException('An API key with this name already exists');
      }
    }

    if (dto.whitelistEntries) {
      for (const entry of dto.whitelistEntries) {
        this.validateWhitelistEntry(entry.type, entry.value);
      }
    }

    const updatedKey = await this.prisma.$transaction(async (transaction) => {
      await transaction.apiKey.update({
        where: { id },
        data: {
          name: dto.name,
          description: dto.description,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        },
      });

      if (dto.whitelistEntries) {
        await transaction.whitelistEntry.deleteMany({
          where: { apiKeyId: id },
        });

        await transaction.whitelistEntry.createMany({
          data: dto.whitelistEntries.map((entry) => ({
            apiKeyId: id,
            type: entry.type,
            value: entry.value.toLowerCase(),
          })),
        });
      }

      return transaction.apiKey.findUnique({
        where: { id },
        include: {
          whitelistEntries: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });

    this.logger.log(`API key updated: ${id}`);

    // Log the API key update in audit service
    await this.auditService.log({
      userId: 'admin', // You might want to pass this as a parameter
      userEmail: 'admin',
      action: AuditAction.API_KEY_UPDATE,
      message: `Updated API key: ${dto.name || existingKey.name}`,
      method: 'PATCH',
      details: {
        apiKeyId: id,
        changes: dto,
      },
    });

    return updatedKey as unknown as ApiKeyResponseDto;
  }

  async revokeApiKey(id: string): Promise<void> {
    const apiKey = await this.prisma.apiKey.findUnique({ where: { id } });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    if (apiKey.status === ApiKeyStatus.REVOKED) {
      throw new BadRequestException('API key is already revoked');
    }

    await this.prisma.apiKey.update({
      where: { id },
      data: { status: ApiKeyStatus.REVOKED },
    });

    this.logger.log(`API key revoked: ${id}`);

    // Log the API key revocation in audit service
    await this.auditService.log({
      userId: 'admin', // You might want to pass this as a parameter
      userEmail: 'admin',
      action: AuditAction.API_KEY_REVOKE,
      message: `Revoked API key: ${apiKey.name}`,
      method: 'DELETE',
      details: {
        apiKeyId: id,
        apiKeyName: apiKey.name,
      },
    });
  }

  async validateApiKey(
    apiKey: string,
    ipAddress: string,
    origin?: string,
  ): Promise<{
    isValid: boolean;
    apiKeyId?: string;
    reason?: string;
  }> {
    try {
      const apiKeys = await this.prisma.apiKey.findMany({
        where: {
          status: ApiKeyStatus.ACTIVE,
        },
        include: {
          whitelistEntries: {
            where: { isActive: true },
          },
        },
      });

      let matchedKey: (typeof apiKeys)[0] | null = null;
      for (const key of apiKeys) {
        const isMatch = await argon2.verify(key.keyHash, apiKey);
        if (isMatch) {
          matchedKey = key;
          break;
        }
      }

      if (!matchedKey) {
        return { isValid: false, reason: 'Invalid API key' };
      }

      if (matchedKey.expiresAt && new Date() > matchedKey.expiresAt) {
        return {
          isValid: false,
          reason: 'API key expired',
          apiKeyId: matchedKey.id,
        };
      }

      if (matchedKey.whitelistEntries.length > 0) {
        const isWhitelisted = this.checkWhitelist(
          matchedKey.whitelistEntries,
          ipAddress,
          origin,
        );

        if (!isWhitelisted) {
          return {
            isValid: false,
            reason: 'IP address or domain not whitelisted',
            apiKeyId: matchedKey.id,
          };
        }
      }

      await this.prisma.apiKey.update({
        where: { id: matchedKey.id },
        data: { lastUsedAt: new Date() },
      });

      return { isValid: true, apiKeyId: matchedKey.id };
    } catch (error) {
      this.logger.error('Error validating API key', error);
      return { isValid: false, reason: 'Validation error' };
    }
  }

  private generateApiKey(): string {
    const randomBytes = crypto.randomBytes(32);
    return `ak_${randomBytes.toString('hex')}`;
  }

  private validateWhitelistEntry(type: WhitelistType, value: string): void {
    switch (type) {
      case WhitelistType.IP_ADDRESS:
        if (!isIP(value)) {
          throw new BadRequestException(`Invalid IP address: ${value}`);
        }
        break;

      case WhitelistType.DOMAIN: {
        const domainRegex =
          /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
        if (!domainRegex.test(value)) {
          throw new BadRequestException(`Invalid domain: ${value}`);
        }
        break;
      }

      case WhitelistType.CIDR_RANGE: {
        const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
        if (!cidrRegex.test(value)) {
          throw new BadRequestException(`Invalid CIDR range: ${value}`);
        }
        break;
      }

      default:
        throw new BadRequestException(`Invalid whitelist type: ${type}`);
    }
  }

  private checkWhitelist(
    whitelistEntries: any[],
    ipAddress: string,
    origin?: string,
  ): boolean {
    for (const entry of whitelistEntries) {
      switch (entry.type) {
        case WhitelistType.IP_ADDRESS:
          if (entry.value === ipAddress) {
            return true;
          }
          break;

        case WhitelistType.DOMAIN:
          if (origin) {
            try {
              const url = new URL(origin);
              if (url.hostname.toLowerCase() === entry.value) {
                return true;
              }
            } catch {
              // Invalid origin URL, skip
            }
          }
          break;

        case WhitelistType.CIDR_RANGE:
          if (this.isIpInCidr(ipAddress, entry.value)) {
            return true;
          }
          break;
      }
    }

    return false;
  }

  private isIpInCidr(ip: string, cidr: string): boolean {
    const [range, prefixLength] = cidr.split('/');
    const prefixLen = parseInt(prefixLength, 10);

    if (!isIP(ip) || !isIP(range)) {
      return false;
    }

    const ipInt = this.ipToInt(ip);
    const rangeInt = this.ipToInt(range);
    const mask = (-1 << (32 - prefixLen)) >>> 0;

    return (ipInt & mask) === (rangeInt & mask);
  }

  private ipToInt(ip: string): number {
    return (
      ip
        .split('.')
        .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
    );
  }
}
