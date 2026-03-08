import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';

export const envConfigOptions: ConfigModuleOptions = {
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    API_GATEWAY_URL: Joi.string().uri().required(),
    API_GATEWAY_PORT: Joi.number().port().required(),
    ECOMMERCE_SERVICE_URL: Joi.string().hostname().required(),
    ECOMMERCE_SERVICE_PORT: Joi.number().port().required(),
  }),
};
