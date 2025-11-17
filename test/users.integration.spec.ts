import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { UsersModule } from '../src/domain/users/users.module';
import { PrismaClient } from '@prisma/client';
import { CacheService } from '../src/common/helpers/cache/cache.service';
import { AuthGuard } from '../src/common/guards/auth.guard';
import { RolesGuard } from '../src/common/guards/roles.guard';

describe('Users Integration Tests', () => {
  let app: NestFastifyApplication;

  const mockPrismaClient = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(PrismaClient)
      .useValue(mockPrismaClient)
      .overrideProvider(CacheService)
      .useValue(mockCacheService)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
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

  describe('GET /users', () => {
    it('should return list of users', async () => {
      const mockUsers = [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: `${faker.string.alphanumeric(10)}@mailinator.com`,
          role: 'USER',
          createdAt: new Date(),
        },
      ];

      mockCacheService.get.mockResolvedValue(null);
      mockPrismaClient.user.findMany.mockResolvedValue(mockUsers);

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(mockPrismaClient.user.findMany).toHaveBeenCalled();
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id', async () => {
      const mockUser = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: `${faker.string.alphanumeric(10)}@mailinator.com`,
        role: 'USER',
        createdAt: new Date(),
      };

      mockCacheService.get.mockResolvedValue(null);
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app.getHttpServer())
        .get('/users/user-1')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalled();
    });
  });

  describe('POST /users', () => {
    it('should create new user', async () => {
      const newUser = {
        name: faker.person.fullName(),
        email: `${faker.string.alphanumeric(10)}@mailinator.com`,
        role: 'USER',
      };

      mockPrismaClient.user.create.mockResolvedValue({
        id: 'user-new',
        ...newUser,
        password: 'temp-password',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(mockPrismaClient.user.create).toHaveBeenCalled();
    });

    it('should return 400 for invalid email', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          name: faker.person.fullName(),
          email: 'invalid-email',
        })
        .expect(400);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update user', async () => {
      const updateData = {
        name: faker.person.fullName(),
      };

      mockPrismaClient.user.update.mockResolvedValue({
        id: faker.string.uuid(),
        name: updateData.name,
        email: `${faker.string.alphanumeric(10)}@mailinator.com`,
        password: 'hashed',
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app.getHttpServer())
        .patch('/users/user-1')
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(mockPrismaClient.user.update).toHaveBeenCalled();
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user', async () => {
      mockPrismaClient.user.delete.mockResolvedValue({
        id: 'user-1',
        name: 'User 1',
        email: 'user1@example.com',
        password: 'hashed',
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await request(app.getHttpServer()).delete('/users/user-1').expect(200);

      expect(mockPrismaClient.user.delete).toHaveBeenCalled();
    });
  });
});
