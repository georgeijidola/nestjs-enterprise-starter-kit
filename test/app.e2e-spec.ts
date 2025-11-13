import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Warehouses', () => {
    let warehouseId: string;

    it('POST /warehouses', async () => {
      const response = await request(app.getHttpServer())
        .post('/warehouses')
        .send({
          name: 'Test Warehouse',
          location: 'Test Location',
        })
        .expect(201);

      warehouseId = response.body.id;
      expect(response.body.name).toBe('Test Warehouse');
    });

    it('GET /warehouses', () => {
      return request(app.getHttpServer())
        .get('/warehouses')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
        });
    });

    it('GET /warehouses/:id', () => {
      return request(app.getHttpServer())
        .get(`/warehouses/${warehouseId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('Test Warehouse');
        });
    });

    it('PATCH /warehouses/:id', () => {
      return request(app.getHttpServer())
        .patch(`/warehouses/${warehouseId}`)
        .send({ name: 'Updated Warehouse' })
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('Updated Warehouse');
        });
    });

    it('DELETE /warehouses/:id', () => {
      return request(app.getHttpServer())
        .delete(`/warehouses/${warehouseId}`)
        .expect(204);
    });
  });

  describe('Suppliers', () => {
    let supplierId: string;

    it('POST /suppliers', async () => {
      const response = await request(app.getHttpServer())
        .post('/suppliers')
        .send({
          name: 'Test Supplier',
          contactName: 'Test Contact',
          phone: '1234567890',
        })
        .expect(201);

      supplierId = response.body.id;
      expect(response.body.name).toBe('Test Supplier');
    });

    it('GET /suppliers', () => {
      return request(app.getHttpServer())
        .get('/suppliers')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
        });
    });

    it('GET /suppliers/:id', () => {
      return request(app.getHttpServer())
        .get(`/suppliers/${supplierId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('Test Supplier');
        });
    });

    it('PATCH /suppliers/:id', () => {
      return request(app.getHttpServer())
        .patch(`/suppliers/${supplierId}`)
        .send({ name: 'Updated Supplier' })
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('Updated Supplier');
        });
    });

    it('DELETE /suppliers/:id', () => {
      return request(app.getHttpServer())
        .delete(`/suppliers/${supplierId}`)
        .expect(204);
    });
  });
});
