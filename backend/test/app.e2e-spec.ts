import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('BrightEyes B2B Platform E2E Integration Tests', () => {
  let app: INestApplication;
  let adminToken: string;
  let wholesalerToken: string;
  let retailerToken: string;
  let createdProductId: string;
  let createdCategoryId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Authentication & RBAC', () => {
    it('POST /api/auth/login -> Should authenticate Super Admin', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@brighteyes.com', password: 'password123' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      adminToken = res.body.data.accessToken;
    });

    it('POST /api/auth/login -> Should authenticate Wholesaler 1', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'wholesaler1@brighteyes.com', password: 'password123' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('WHOLESALER');
      wholesalerToken = res.body.data.accessToken;
    });

    it('POST /api/auth/login -> Should authenticate Retailer 1', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'retailer1@brighteyes.com', password: 'password123' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('RETAILER');
      retailerToken = res.body.data.accessToken;
    });

    it('GET /api/auth/me -> Should return current profile', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${retailerToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('retailer1@brighteyes.com');
    });
  });

  describe('2. Categories & Products', () => {
    it('GET /api/categories -> Should list categories', async () => {
      const res = await request(app.getHttpServer()).get('/api/categories').expect(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      createdCategoryId = res.body.data[0].id;
    });

    it('GET /api/products -> Should search and list active products', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/products?search=Ray-Ban')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.meta.total).toBeDefined();
    });

    it('POST /api/products -> Should create new product (Wholesaler)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${wholesalerToken}`)
        .send({
          SKU: `TEST-SKU-${Date.now()}`,
          name: 'Test Eyewear Frame 2026',
          description: 'E2E Testing Frame',
          categoryId: createdCategoryId,
          brand: 'TestBrand',
          productType: 'FRAME',
          price: 100.0,
          wholesalePrice: 60.0,
          quantity: 50,
          lowStockThreshold: 5,
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.inventory.availableQuantity).toBe(50);
      createdProductId = res.body.data.id;
    });

    it('POST /api/products -> Should block Retailer from creating products', async () => {
      await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${retailerToken}`)
        .send({
          SKU: 'ILLEGAL-SKU',
          name: 'Unauthorized Frame',
          categoryId: createdCategoryId,
          brand: 'None',
          price: 50,
          wholesalePrice: 30,
          quantity: 10,
        })
        .expect(403);
    });
  });

  describe('3. Cart & Stock Validation', () => {
    it('POST /api/cart/items -> Add item to cart with stock validation', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${retailerToken}`)
        .send({
          productId: createdProductId,
          quantity: 5,
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBeGreaterThan(0);
    });

    it('POST /api/cart/items -> Reject quantity exceeding available stock', async () => {
      await request(app.getHttpServer())
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${retailerToken}`)
        .send({
          productId: createdProductId,
          quantity: 99999,
        })
        .expect(400);
    });
  });

  describe('4. B2B Order Creation & Transactional Stock Reservation', () => {
    it('POST /api/orders -> Create order from cart', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/orders')
        .set('Authorization', `Bearer ${retailerToken}`)
        .send({
          shippingAddress: '123 Phnom Penh St, Cambodia',
          province: 'Phnom Penh',
          district: 'Sen Sok',
          phone: '+85512999888',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.orderNumber).toBeDefined();
      expect(res.body.data.orderStatus).toBe('PENDING');
    });

    it('GET /api/inventory -> Verify stock was reserved', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/inventory')
        .set('Authorization', `Bearer ${wholesalerToken}`)
        .expect(200);

      const targetItem = res.body.data.find((i: any) => i.productId === createdProductId);
      expect(targetItem).toBeDefined();
      expect(targetItem.reservedQuantity).toBe(5);
      expect(targetItem.availableQuantity).toBe(45);
    });
  });

  describe('5. Admin Platform Metrics', () => {
    it('GET /api/admin/overview -> Super Admin platform stats', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admin/overview')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.totalUsers).toBeGreaterThan(0);
      expect(res.body.data.totalProducts).toBeGreaterThan(0);
    });
  });
});
