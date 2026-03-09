import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';

export const envConfigOptions: ConfigModuleOptions = {
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    PRODUCT_MICROSERVICE_HOST: Joi.string().hostname().required(),
    PRODUCT_MICROSERVICE_HTTP_PORT: Joi.number().port().required(),
    MYSQL_ROOT_PASSWORD: Joi.string().required(),
    MYSQL_USER: Joi.string().required(),
    MYSQL_PASSWORD: Joi.string().required(),
    MYSQL_DATABASE: Joi.string().required(),
  }),
};
