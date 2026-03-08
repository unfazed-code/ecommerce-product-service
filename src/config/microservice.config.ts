import { ConfigModule, ConfigService } from '@nestjs/config';
import { TcpClientOptions, Transport } from '@nestjs/microservices';
import { envConfigOptions } from './env.config';

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
    imports: [ConfigModule.forRoot(envConfigOptions)],
    name: ECOMMERCE_SERVICE_CLIENT,
    useFactory: (configService: ConfigService) =>
      ecommerceClientProxyConfig(
        configService.getOrThrow('ECOMMERCE_SERVICE_HOST'),
        configService.getOrThrow('ECOMMERCE_SERVICE_PORT'),
      ),
    inject: [ConfigService],
  },
];
