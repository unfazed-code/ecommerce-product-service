import { ConfigModule, ConfigService } from '@nestjs/config';
import { TcpClientOptions, Transport } from '@nestjs/microservices';

export const ECOMMERCE_SERVICE_CLIENT = Symbol('ECOMMERCE_SERVICE');

export const ecommerceClientProxyConfig = (
  host: string,
  port: number,
): TcpClientOptions => ({
  transport: Transport.TCP,
  options: { host, port },
});

export const clientProxyConfigs = [
  {
    imports: [ConfigModule],
    name: ECOMMERCE_SERVICE_CLIENT,
    useFactory: (configService: ConfigService) =>
      ecommerceClientProxyConfig(
        configService.getOrThrow('ECOMMERCE_SERVICE_URL'),
        configService.getOrThrow('ECOMMERCE_SERVICE_PORT'),
      ),
    inject: [ConfigService],
  },
];
