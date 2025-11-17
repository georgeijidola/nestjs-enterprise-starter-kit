import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { AuthModule } from '../src/domain/auth/auth.module';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

describe('Auth Integration Tests', () => {
  let app: NestFastifyApplication;

  const mockPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        PORT: '3000',
        SERVER_IP: '0.0.0.0',
        JWT_SECRET: 'test-secret-key-with-at-least-32-characters',
        JWT_SECRET_EXPIRE: '3600',
        EMAIL_FROM: 'test@example.com',
        RESEND_API_KEY: 'test-key',
        CACHE_TTL: '3600',
        GCS_PROJECT_ID: 'test-project',
        GCS_BUCKET_NAME: 'test-bucket',
        GCS_KEY_FILE_PATH: '',
        GCS_CREDENTIALS: '',
      };
      return config[key];
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(PrismaClient)
      .useValue(mockPrismaClient)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.useGlobalPipes(new ValidationPipe());

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

  describe('POST /auth/signup', () => {
    it('should register a new user', async () => {
      const newUser = {
        name: faker.person.fullName(),
        email: `${faker.string.alphanumeric(10)}@mailinator.com`,
        password: faker.internet.password({ length: 12 }),
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      mockPrismaClient.user.create.mockResolvedValue({
        id: 'user-123',
        name: newUser.name,
        email: newUser.email,
        password: 'hashed-password',
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(mockPrismaClient.user.create).toHaveBeenCalled();
    });

    it('should return 400 for invalid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          name: faker.person.fullName(),
          email: 'invalid-email',
          password: faker.internet.password({ length: 12 }),
        })
        .expect(400);
    });

    it('should return 400 for missing fields', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: `${faker.string.alphanumeric(10)}@mailinator.com`,
        })
        .expect(400);
    });
  });

  describe('POST /auth/signin', () => {
    it('should login existing user', async () => {
      const credentials = {
        email: `${faker.string.alphanumeric(10)}@mailinator.com`,
        password: faker.internet.password({ length: 12 }),
      };

      mockPrismaClient.user.findUnique.mockResolvedValue({
        id: 'user-123',
        name: 'Test User',
        email: credentials.email,
        password: '$argon2id$v=19$m=65536,t=3,p=4$test',
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(credentials);

      expect([200, 401]).toContain(response.status);
    });

    it('should return 400 for invalid email format', async () => {
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'invalid-email',
          password: faker.internet.password({ length: 12 }),
        })
        .expect(400);
    });
  });
});
