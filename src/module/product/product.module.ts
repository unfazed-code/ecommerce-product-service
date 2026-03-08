import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { EcommerceLoggerService } from '../../utils/logger.service';
import { ConfigModule } from '@nestjs/config';
import { envConfigOptions } from 'src/config/env.config';
import { DatabaseModule } from 'src/utils/database.module';

@Module({
  imports: [ConfigModule.forRoot(envConfigOptions), DatabaseModule],
  controllers: [ProductController],
  providers: [ProductService, EcommerceLoggerService],
})
export class EcommerceModule {}
