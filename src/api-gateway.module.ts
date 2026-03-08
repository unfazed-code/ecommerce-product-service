import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ClientsModule } from '@nestjs/microservices';
import { clientProxyConfigs } from './config/microservice.config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { rateLimitConfig } from './config/ratelimit.config';
import { APP_GUARD } from '@nestjs/core';
import { envConfigOptions } from './config/env.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(envConfigOptions),
    ClientsModule.registerAsync(clientProxyConfigs),
    ThrottlerModule.forRoot(rateLimitConfig),
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
