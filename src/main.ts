import { NestFactory } from '@nestjs/core';
import { AppModule } from './api-gateway.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductModule } from './module/product/product.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from './utils/http-exception-filter';

async function bootstrap() {
  // gateway service (http) + ecommerce microservice (tcp)
  const apiGatewayLogger = new Logger('api-gateway-svc');
  const productMicroserviceLogger = new Logger('product-svc');
  const apiGatewayService = await NestFactory.create(AppModule, {
    logger: apiGatewayLogger,
  });
  const productMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(ProductModule, {
      transport: Transport.TCP,
      logger: productMicroserviceLogger,
      options: {
        host: process.env.ECOMMERCE_SERVICE_URL,
        port: Number(process.env.ECOMMERCE_SERVICE_PORT),
      },
    });

  // Swagger setup
  const documentFactory = () =>
    SwaggerModule.createDocument(apiGatewayService, swaggerConfig);
  SwaggerModule.setup('api-doc', apiGatewayService, documentFactory);

  // Helmet + Cors
  apiGatewayService.use(helmet());
  apiGatewayService.useGlobalPipes(new ValidationPipe());
  apiGatewayService.useGlobalFilters(new ExceptionFilter());
  productMicroservice.useGlobalFilters(new ExceptionFilter());
  apiGatewayService.enableCors();

  await productMicroservice.listen();
  productMicroserviceLogger.log(
    `Product microservice listening on port ${process.env.ECOMMERCE_SERVICE_PORT}`,
  );
  await apiGatewayService.listen(Number(process.env.API_GATEWAY_PORT));
  apiGatewayLogger.log(
    `Api Gateway service listening on port ${process.env.API_GATEWAY_PORT}`,
  );
}
bootstrap();
