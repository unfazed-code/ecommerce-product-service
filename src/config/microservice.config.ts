import { ConfigService } from '@nestjs/config';
import { TcpClientOptions, Transport } from '@nestjs/microservices';

export const PRODUCT_SERVICE_CLIENT = Symbol('PRODUCT_SERVICE_CLIENT');

export const ecommerceClientProxyConfig = (
  host: string,
  port: number,
): TcpClientOptions => ({
  transport: Transport.TCP,
  options: { host, port },
});

export const clientProxyConfigs = [
  {
    name: PRODUCT_SERVICE_CLIENT,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      ecommerceClientProxyConfig(
        configService.getOrThrow('ECOMMERCE_SERVICE_HOST'),
        configService.getOrThrow('ECOMMERCE_SERVICE_PORT'),
      ),
  },
];
