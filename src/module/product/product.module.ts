import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { LoggerService } from '../../utils/logger.service';
import { ConfigModule } from '@nestjs/config';
import { envConfigOptions } from 'src/config/env.config';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from 'src/config/database.config';
import { Product } from './product.entity';

@Module({
  imports: [
    ConfigModule.forRoot(envConfigOptions),
    SequelizeModule.forRootAsync(sequelizeConfig),
    SequelizeModule.forFeature([Product]),
  ],
  controllers: [ProductController],
  providers: [ProductService, LoggerService],
  exports: [ConfigModule],
})
export class ProductModule {}
