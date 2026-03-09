import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { ProductRpcController } from './controller/product-rpc.controller';
import { LoggerService } from '../../utils/logger.service';
import { ConfigModule } from '@nestjs/config';
import { envConfigOptions } from 'src/config/env.config';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from 'src/config/database.config';
import { Product } from './model/product.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { rateLimitConfig } from 'src/config/ratelimit.config';
import { clientProxyConfigs } from 'src/config/microservice.config';
import { ClientsModule } from '@nestjs/microservices';
import { ProductHttpController } from './controller/product-http.controller';
import { CustomThrottlerGuard } from 'src/utils/custom-throttler.guard';

@Module({
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
})
export class ProductModule {}
