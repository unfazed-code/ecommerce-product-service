import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EcommerceModule } from './module/ecommerce.module';
import { ClientsModule } from '@nestjs/microservices';
import { ecommerceClientProxyConfig } from './config/microservice.config';

@Module({
  imports: [
    ClientsModule.register([ecommerceClientProxyConfig]),
    EcommerceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
