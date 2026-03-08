import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { EcommerceLoggerService } from './logger.service';
import { ConfigModule } from '@nestjs/config';
import { envConfigOptions } from 'src/config/env.config';

@Module({
  imports: [ConfigModule.forRoot(envConfigOptions)],
  controllers: [ProductController],
  providers: [ProductService, EcommerceLoggerService],
})
export class EcommerceModule {}
