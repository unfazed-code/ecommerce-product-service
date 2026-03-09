import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ProductModule } from './module/product/product.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from './utils/http-exception-filter';

async function bootstrap() {
  // product microservice
  const productMicroserviceLogger = new Logger('product-svc');
  const productMicroservice = await NestFactory.create(ProductModule);
  // Helmet + Cors
  productMicroservice.use(helmet());
  productMicroservice.enableCors();

  // Pipes + filters
  productMicroservice.useGlobalPipes(new ValidationPipe());
  productMicroservice.useGlobalFilters(new ExceptionFilter());

  // Tcp
  productMicroservice.connectMicroservice(
    {
      transport: Transport.TCP,
      logger: productMicroserviceLogger,
      options: {
        host: process.env.PRODUCT_MICROSERVICE_HOST,
        port: Number(process.env.PRODUCT_MICROSERVICE_TCP_PORT),
      },
    },
    { inheritAppConfig: true },
  );

  // Swagger setup
  const documentFactory = () =>
    SwaggerModule.createDocument(productMicroservice, swaggerConfig);
  SwaggerModule.setup('product-api-doc', productMicroservice, documentFactory);

  await productMicroservice.startAllMicroservices();

  await productMicroservice.listen(
    Number(process.env.PRODUCT_MICROSERVICE_HTTP_PORT),
  );
  productMicroserviceLogger.log(
    `Product microservice listening on port ${process.env.PRODUCT_MICROSERVICE_HTTP_PORT} (http)`,
    `Product microservice listening on port ${process.env.PRODUCT_MICROSERVICE_TCP_PORT} (tcp)`,
  );
}
bootstrap();
