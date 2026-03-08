import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const ECOMMERCE_SERVICE_CLIENT = Symbol('ECOMMERCE_SERVICE');

export const ecommerceClientProxyConfig: ClientProviderOptions = {
  name: ECOMMERCE_SERVICE_CLIENT,
  transport: Transport.TCP,
  options: { host: 'localhost', port: 3001 },
};
