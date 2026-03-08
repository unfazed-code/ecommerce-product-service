import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { EcommerceModule } from './module/ecommerce/ecommerce.module';
import { ClientsModule } from '@nestjs/microservices';
import { clientProxyConfigs } from './config/microservice.config';
import { ConfigModule } from '@nestjs/config';
import { envConfigOptions } from './config/env.config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { rateLimitConfig } from './config/ratelimit.config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(envConfigOptions),
    ClientsModule.registerAsync(clientProxyConfigs),
    ThrottlerModule.forRoot(rateLimitConfig),
    EcommerceModule,
  ],
  controllers: [ApiGatewayController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
