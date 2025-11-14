import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import request from 'supertest';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('App (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
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

  describe('Health Check', () => {
    it('/ (GET) - should return health status', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('status');
          expect(response.body.status).toBe('running');
        });
    });
  });
});

// Integration tests with mocked dependencies are available in:
// - test/auth.integration.spec.ts
// - test/users.integration.spec.ts
// - test/health.integration.spec.ts
