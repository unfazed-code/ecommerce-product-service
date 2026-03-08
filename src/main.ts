import { NestFactory } from '@nestjs/core';
import { AppModule } from './api-gateway.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EcommerceModule } from './module/ecommerce/ecommerce.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import helmet from 'helmet';

async function bootstrap() {
  // Main app (http) + ecommerce microservice (tcp)
  const apiGatewayApp = await NestFactory.create(AppModule);
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
    SwaggerModule.createDocument(apiGatewayApp, swaggerConfig);
  SwaggerModule.setup('api-doc', apiGatewayApp, documentFactory);

  // Helmet + Cors
  apiGatewayApp.use(helmet());
  apiGatewayApp.enableCors();

  await ecommerceMicroservice.listen();
  await apiGatewayApp.listen(Number(process.env.API_GATEWAY_PORT));
}
bootstrap();
