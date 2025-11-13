import { Test, TestingModule } from '@nestjs/testing';
import {
  HealthCheckService,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { HealthService } from './health.service';
import { PrismaClient } from '@prisma/client';
import { RedisHealthIndicator } from './redis-health.indicator';
import { ServerHealthIndicator } from './server-health.indicator';

describe('HealthService', () => {
  let service: HealthService;
  let healthCheckService: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: PrismaHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
        {
          provide: MemoryHealthIndicator,
          useValue: {
            checkHeap: jest.fn(),
            checkRSS: jest.fn(),
          },
        },
        {
          provide: DiskHealthIndicator,
          useValue: {
            checkStorage: jest.fn(),
          },
        },
        {
          provide: RedisHealthIndicator,
          useValue: {
            isHealthy: jest.fn(),
          },
        },
        {
          provide: ServerHealthIndicator,
          useValue: {
            isHealthy: jest.fn(),
          },
        },
        {
          provide: PrismaClient,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check database health', async () => {
    const mockResult = {
      status: 'ok' as any,
      info: { database: { status: 'up' as any } },
      details: { database: { status: 'up' as any } },
    };
    jest.spyOn(healthCheckService, 'check').mockResolvedValue(mockResult);

    const result = await service.checkDatabase();
    expect(result).toEqual(mockResult);
    expect(healthCheckService.check).toHaveBeenCalled();
  });

  it('should check Redis health', async () => {
    const mockResult = {
      status: 'ok' as any,
      info: { redis: { status: 'up' as any } },
      details: { redis: { status: 'up' as any } },
    };
    jest.spyOn(healthCheckService, 'check').mockResolvedValue(mockResult);

    const result = await service.checkRedis();
    expect(result).toEqual(mockResult);
    expect(healthCheckService.check).toHaveBeenCalled();
  });

  it('should check server health', async () => {
    const mockResult = {
      status: 'ok' as any,
      info: { server: { status: 'up' as any } },
      details: { server: { status: 'up' as any } },
    };
    jest.spyOn(healthCheckService, 'check').mockResolvedValue(mockResult);

    const result = await service.checkServer();
    expect(result).toEqual(mockResult);
    expect(healthCheckService.check).toHaveBeenCalled();
  });

  it('should check all components', async () => {
    const mockResult = {
      status: 'ok' as any,
      info: {
        database: { status: 'up' as any },
        redis: { status: 'up' as any },
        server: { status: 'up' as any },
        memory_heap: { status: 'up' as any },
        memory_rss: { status: 'up' as any },
        storage: { status: 'up' as any },
      },
      details: {
        database: { status: 'up' as any },
        redis: { status: 'up' as any },
        server: { status: 'up' as any },
        memory_heap: { status: 'up' as any },
        memory_rss: { status: 'up' as any },
        storage: { status: 'up' as any },
      },
    };
    jest.spyOn(healthCheckService, 'check').mockResolvedValue(mockResult);

    const result = await service.checkAll();
    expect(result).toEqual(mockResult);
    expect(healthCheckService.check).toHaveBeenCalled();
  });
});
