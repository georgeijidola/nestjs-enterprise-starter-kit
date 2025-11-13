import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { AuditAction, PrismaClient } from '@prisma/client';

describe('AuditService', () => {
  let service: AuditService;

  const mockPrismaClient = {
    auditLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: PrismaClient,
          useValue: mockPrismaClient,
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('should create an audit log entry', async () => {
      const entry = {
        userId: 'user-123',
        userEmail: 'test@example.com',
        action: AuditAction.API_KEY_CREATE,
        message: 'API key created successfully',
        method: 'POST',
        details: { name: 'Test API Key' },
      };

      mockPrismaClient.auditLog.create.mockResolvedValue({
        auditId: 'audit-123',
      });

      await service.log(entry);

      expect(mockPrismaClient.auditLog.create).toHaveBeenCalledWith({
        data: entry,
      });
    });

    it('should handle errors gracefully', async () => {
      const entry = {
        userId: 'user-123',
        userEmail: 'test@example.com',
        action: AuditAction.RESET_PASSWORD,
        message: 'Password reset failed',
        method: 'POST',
      };

      mockPrismaClient.auditLog.create.mockRejectedValue(
        new Error('Database error'),
      );

      // Should not throw error
      await expect(service.log(entry)).resolves.not.toThrow();
    });
  });

  describe('getAuditLogs', () => {
    it('should return paginated audit logs', async () => {
      const mockLogs = [
        {
          auditId: 'audit-1',
          action: AuditAction.API_KEY_CREATE,
          message: 'API key created',
          method: 'POST',
          createdAt: new Date(),
          User: {
            id: 'user-123',
            name: 'Test User',
            email: 'test@example.com',
            role: 'ADMIN',
          },
        },
      ];

      mockPrismaClient.auditLog.findMany.mockResolvedValue(mockLogs);
      mockPrismaClient.auditLog.count.mockResolvedValue(1);

      const result = await service.getAuditLogs(1, 20);

      expect(result).toEqual({
        logs: mockLogs,
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    it('should apply filters correctly', async () => {
      const filters = {
        userId: 'user-123',
        action: AuditAction.API_KEY_CREATE,
        userEmail: 'test@example.com',
      };

      mockPrismaClient.auditLog.findMany.mockResolvedValue([]);
      mockPrismaClient.auditLog.count.mockResolvedValue(0);

      await service.getAuditLogs(1, 20, filters);

      expect(mockPrismaClient.auditLog.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          action: { contains: AuditAction.API_KEY_CREATE, mode: 'insensitive' },
          userEmail: { contains: 'test@example.com', mode: 'insensitive' },
        },
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
        skip: 0,
        take: 20,
      });
    });

    it('should handle empty filters', async () => {
      mockPrismaClient.auditLog.findMany.mockResolvedValue([]);
      mockPrismaClient.auditLog.count.mockResolvedValue(0);

      await service.getAuditLogs(1, 20);

      expect(mockPrismaClient.auditLog.findMany).toHaveBeenCalledWith({
        where: {},
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
        skip: 0,
        take: 20,
      });
    });

    it('should calculate pagination correctly', async () => {
      mockPrismaClient.auditLog.findMany.mockResolvedValue([]);
      mockPrismaClient.auditLog.count.mockResolvedValue(100);

      const result = await service.getAuditLogs(3, 10);

      expect(result.totalPages).toBe(10);
      expect(mockPrismaClient.auditLog.findMany).toHaveBeenCalledWith({
        where: {},
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
        skip: 20,
        take: 10,
      });
    });
  });
});
