import { NestFactory } from '@nestjs/core';
import { AppModule } from './api-gateway.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EcommerceModule } from './module/product/product.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import helmet from 'helmet';

async function bootstrap() {
  // test service (http) + ecommerce microservice (tcp)
  const apiGatewayService = await NestFactory.create(AppModule);
  const ecommerceMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(EcommerceModule, {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: Number(process.env.ECOMMERCE_SERVICE_PORT),
      },
    });

  // Swagger setup
  const documentFactory = () =>
    SwaggerModule.createDocument(apiGatewayService, swaggerConfig);
  SwaggerModule.setup('api-doc', apiGatewayService, documentFactory);

  // Helmet + Cors
  apiGatewayService.use(helmet());
  apiGatewayService.enableCors();

  await ecommerceMicroservice.listen();
  await apiGatewayService.listen(Number(process.env.API_GATEWAY_PORT));
}
bootstrap();
