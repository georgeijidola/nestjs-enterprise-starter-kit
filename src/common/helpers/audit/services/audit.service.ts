import { Injectable, Logger } from '@nestjs/common';
import { AuditAction, PrismaClient } from '@prisma/client';
import { AuditLogFiltersDto, CreateAuditLogDto } from '../dtos/audit-log.dto';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaClient) {}

  async log(entry: CreateAuditLogDto): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: entry.userId,
          userEmail: entry.userEmail,
          action: entry.action as AuditAction,
          message: entry.message,
          method: entry.method,
          details: entry.details,
        },
      });

      this.logger.log(
        `Audit log created: ${entry.action} by ${entry.userEmail}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create audit log: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Get audit logs with pagination
   */
  async getAuditLogs(
    page: number = 1,
    limit: number = 20,
    filters?: AuditLogFiltersDto,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters?.userId) where.userId = filters.userId;
    if (filters?.userEmail)
      where.userEmail = { contains: filters.userEmail, mode: 'insensitive' };
    if (filters?.action)
      where.action = { contains: filters.action, mode: 'insensitive' };
    if (filters?.createdAt) where.createdAt = filters.createdAt;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
