import { ConfigService } from '@nestjs/config';
import { TcpClientOptions, Transport } from '@nestjs/microservices';

export const PRODUCT_SERVICE_CLIENT = Symbol('PRODUCT_SERVICE_CLIENT');

export const productClientProxyConfig = (
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
      productClientProxyConfig(
        configService.getOrThrow('PRODUCT_MICROSERVICE_HOST'),
        configService.getOrThrow('NODE_ENV') === 'test'
          ? configService.getOrThrow('TEST_PRODUCT_MICROSERVICE_TCP_PORT')
          : configService.getOrThrow('PRODUCT_MICROSERVICE_TCP_PORT'),
      ),
  },
];
