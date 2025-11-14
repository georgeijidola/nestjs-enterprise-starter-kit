import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import request from 'supertest';
import { HealthController } from '../src/health.controller';
import { HealthService } from '../src/health/health.service';
import { HealthCheckService } from '@nestjs/terminus';

describe('Health Integration Tests', () => {
  let app: NestFastifyApplication;

  const mockHealthService = {
    checkAll: jest.fn(),
    checkDatabase: jest.fn(),
    checkRedis: jest.fn(),
    checkServer: jest.fn(),
  };

  const mockHealthCheckService = {
    check: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mockHealthService,
        },
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return comprehensive health status', async () => {
      const mockHealthStatus = {
        status: 'ok',
        info: {
          database: { status: 'up' },
          redis: { status: 'up' },
          server: { status: 'up' },
        },
        details: {
          database: { status: 'up' },
          redis: { status: 'up' },
          server: { status: 'up' },
        },
      };

      mockHealthService.checkAll.mockResolvedValue(mockHealthStatus);

      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(mockHealthService.checkAll).toHaveBeenCalled();
    });
  });

  describe('GET /health/database', () => {
    it('should return database health status', async () => {
      const mockDbHealth = {
        status: 'ok',
        info: { database: { status: 'up' } },
        details: { database: { status: 'up' } },
      };

      mockHealthService.checkDatabase.mockResolvedValue(mockDbHealth);

      const response = await request(app.getHttpServer())
        .get('/health/database')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(mockHealthService.checkDatabase).toHaveBeenCalled();
    });
  });

  describe('GET /health/redis', () => {
    it('should return redis health status', async () => {
      const mockRedisHealth = {
        status: 'ok',
        info: { redis: { status: 'up' } },
        details: { redis: { status: 'up' } },
      };

      mockHealthService.checkRedis.mockResolvedValue(mockRedisHealth);

      const response = await request(app.getHttpServer())
        .get('/health/redis')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(mockHealthService.checkRedis).toHaveBeenCalled();
    });
  });

  describe('GET /health/server', () => {
    it('should return server health status', async () => {
      const mockServerHealth = {
        status: 'ok',
        info: { server: { status: 'up' } },
        details: { server: { status: 'up' } },
      };

      mockHealthService.checkServer.mockResolvedValue(mockServerHealth);

      const response = await request(app.getHttpServer())
        .get('/health/server')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(mockHealthService.checkServer).toHaveBeenCalled();
    });
  });
});
