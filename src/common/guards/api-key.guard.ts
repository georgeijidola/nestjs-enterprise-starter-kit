import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiKeyService } from '../../domain/api-key/services/api-key.service';
import { AuditService } from '../helpers/audit/services/audit.service';
import { AuditAction } from '@prisma/client';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly auditService: AuditService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if API key validation is enabled
    const isEnabled = process.env.API_KEY_ENABLED === 'true';
    if (!isEnabled) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const endpoint = request.route?.path || request.url;
    const method = request.method;
    const ipAddress = this.getClientIp(request);
    const userAgent = request.headers['user-agent'];
    const origin = request.headers.origin || request.headers.referer;

    const apiKey = this.extractApiKey(request);

    let isAuthorized = false;
    let apiKeyId: string | undefined;
    let reason: string | undefined;
    let responseCode = 401;

    try {
      if (!apiKey) {
        reason = 'Missing API key';
        throw new UnauthorizedException('API key is required');
      }

      const validation = await this.apiKeyService.validateApiKey(
        apiKey,
        ipAddress,
        origin,
      );

      if (!validation.isValid) {
        reason = validation.reason;
        apiKeyId = validation.apiKeyId;

        if (reason?.includes('not whitelisted')) {
          responseCode = 403;
          throw new ForbiddenException(
            'Access denied: IP address or domain not whitelisted',
          );
        } else {
          throw new UnauthorizedException(
            validation.reason || 'Invalid API key',
          );
        }
      }

      isAuthorized = true;
      apiKeyId = validation.apiKeyId;
      responseCode = 200;

      request.apiKeyId = apiKeyId;

      return true;
    } catch (error) {
      await this.auditService.log({
        userId: null,
        userEmail: 'api-key-access',
        action: AuditAction.API_KEY_ACCESS_DENIED,
        message: `API access denied: ${reason || 'Unknown error'}`,
        method: `${method} ${endpoint}`,
        details: {
          apiKeyId,
          ipAddress,
          userAgent,
          origin,
          reason,
          responseCode,
        },
      });

      throw error;
    } finally {
      if (isAuthorized) {
        await this.auditService.log({
          userId: null,
          userEmail: 'api-key-access',
          action: AuditAction.API_KEY_ACCESS_AUTHORIZED,
          message: `API access authorized`,
          method: `${method} ${endpoint}`,
          details: {
            apiKeyId,
            ipAddress,
            userAgent,
            origin,
            responseCode,
          },
        });
      }
    }
  }

  private extractApiKey(request: any): string | null {
    const authHeader = request.headers.authorization;
    const apiKeyHeader = request.headers['x-api-key'];
    const queryParam = request.query.apiKey;

    if (apiKeyHeader) {
      return apiKeyHeader;
    }

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (token.startsWith('ak_')) {
        return token;
      }
    }

    if (queryParam) {
      return queryParam;
    }

    return null;
  }

  private getClientIp(request: any): string {
    const xForwardedFor = request.headers['x-forwarded-for'];
    const xRealIp = request.headers['x-real-ip'];
    const xClientIp = request.headers['x-client-ip'];
    const cfConnectingIp = request.headers['cf-connecting-ip'];

    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }

    if (xRealIp) {
      return xRealIp;
    }

    if (xClientIp) {
      return xClientIp;
    }

    if (cfConnectingIp) {
      return cfConnectingIp;
    }

    return (
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip ||
      '127.0.0.1'
    );
  }
}
