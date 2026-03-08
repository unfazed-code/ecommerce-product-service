import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EcommerceModule } from './module/ecommerce.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const ecommerceMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(EcommerceModule, {
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3001 },
    });

  await ecommerceMicroservice.listen();
  await app.listen(3000);
}
bootstrap();
