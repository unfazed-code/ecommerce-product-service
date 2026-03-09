import { ConfigService } from '@nestjs/config';
import {
  SequelizeModuleAsyncOptions,
  SequelizeModuleOptions,
} from '@nestjs/sequelize';
import { Product } from 'src/module/product/model/product.entity';

export const sequelizeConfig: SequelizeModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      dialect: 'mysql',
      host: configService.getOrThrow('MYSQL_HOST'),
      port: 3306,
      username: configService.getOrThrow('MYSQL_USER'),
      password: configService.getOrThrow('MYSQL_PASSWORD'),
      database: configService.getOrThrow('MYSQL_DATABASE'),
      models: [Product],
      synchronize:
        configService.getOrThrow('NODE_ENV') === 'production' ? false : true,
      autoLoadModels: true,
    } as SequelizeModuleOptions;
  },
};
