/* eslint-disable  @typescript-eslint/no-unsafe-assignment */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ConfigModule } from '@nestjs/config';
import { envConfigOptions } from '../src/config/env.config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ThrottlerModule } from '@nestjs/throttler';
import { sequelizeConfig } from '../src/config/database.config';
import { Product } from '../src/module/product/model/product.entity';
import { clientProxyConfigs } from '../src/config/microservice.config';
import { rateLimitConfig } from '../src/config/ratelimit.config';
import { ProductRpcController } from '../src/module/product/controller/product-rpc.controller';
import { ProductHttpController } from '../src/module/product/controller/product-http.controller';
import { ProductService } from '../src/module/product/service/product.service';
import { LoggerService } from '../src/utils/logger.service';
import { CustomThrottlerGuard } from '../src/utils/custom-throttler.guard';
import { Sequelize } from 'sequelize-typescript';
import {
  ProductPaginationResponse,
  ProductResponseDto,
} from '../src/module/product/dto/product-response.dto';
import { ExceptionFilter } from '../src/utils/http-exception-filter';

describe('ProductController (e2e)', () => {
  let app: INestApplication<App>;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfigOptions),
        SequelizeModule.forRootAsync(sequelizeConfig),
        SequelizeModule.forFeature([Product]),
        ClientsModule.registerAsync(clientProxyConfigs),
        ThrottlerModule.forRoot(rateLimitConfig),
      ],
      controllers: [ProductRpcController, ProductHttpController],
      providers: [ProductService, LoggerService, CustomThrottlerGuard],
      exports: [ConfigModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new ExceptionFilter());

    sequelize = moduleFixture.get<Sequelize>(Sequelize);

    app.connectMicroservice(
      {
        transport: Transport.TCP,
        options: {
          host: process.env.PRODUCT_MICROSERVICE_HOST,
          port: Number(process.env.TEST_PRODUCT_MICROSERVICE_TCP_PORT),
        },
      },
      { inheritAppConfig: true },
    );
    await app.startAllMicroservices();
    await app.listen(Number(process.env.TEST_PRODUCT_MICROSERVICE_HTTP_PORT));
  });

  beforeAll(async () => {
    await sequelize.truncate({ cascade: true });
  });

  afterAll(async () => {
    await app.close();
  });

  it('/products (POST) - should create a product', async () => {
    const createProductDto = {
      name: 'Test Product',
      price: 29.99,
      stock: 100,
      productToken: 'test-token-123',
    };

    const response = await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201);
    await request(app.getHttpServer())
      .post('/products')
      .send({
        ...createProductDto,
        name: 'Test Product 2',
        productToken: 'test-token-789',
      })
      .expect(201);

    expect(response.body as ProductResponseDto).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'Test Product',
        price: 29.99,
        stock: 100.0,
        productToken: 'test-token-123',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it('/products (POST) - should not create a product if existing productToken', async () => {
    const createProductDto = {
      name: 'Test Product',
      price: 29.99,
      stock: 100,
      productToken: 'test-token-123',
    };

    await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(400);
  });

  it('/products (GET) - should get all products', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect((response.body as ProductPaginationResponse).data).toHaveLength(2);
  });

  it('/products/1 (GET) - should get product with id 1', async () => {
    const response = await request(app.getHttpServer())
      .get('/products/1')
      .expect(200);

    expect((response.body as ProductResponseDto).id).toBe(1);
    expect((response.body as ProductResponseDto).productToken).toBe(
      'test-token-123',
    );
    expect((response.body as ProductResponseDto).price).toBe(29.99);
    expect((response.body as ProductResponseDto).stock).toBe(100);
  });

  it("/products (PATCH) - should update product's stock quantity", async () => {
    const product: ProductResponseDto = (
      await request(app.getHttpServer()).get('/products/1')
    ).body;

    const response = await request(app.getHttpServer())
      .patch('/products/1')
      .send({ stock: 20 })
      .expect(200);

    expect((response.body as ProductResponseDto).stock).toBe(20);
    expect((response.body as ProductResponseDto).updatedAt).not.toBe(
      product.updatedAt,
    );
  });

  it('/products/1 (DELETE) - should delete a product', async () => {
    await request(app.getHttpServer()).delete('/products/1').expect(204);
    await request(app.getHttpServer()).get('/products/1').expect(404);
    const products: ProductPaginationResponse = (
      await request(app.getHttpServer()).get('/products').expect(200)
    ).body;
    expect(products.data).toHaveLength(1);
  });
});
