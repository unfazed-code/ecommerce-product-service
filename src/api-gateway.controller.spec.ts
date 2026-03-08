import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatewayController } from './api-gateway.controller';
import { ecommerceClientProxyConfig } from './config/microservice.config';
import { ClientsModule } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

let app: TestingModule;

describe('ApiGatewayController', () => {
  let apiGatewayController: ApiGatewayController;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [ClientsModule.register([ecommerceClientProxyConfig])],
      controllers: [ApiGatewayController],
      providers: [],
    }).compile();

    apiGatewayController = app.get<ApiGatewayController>(ApiGatewayController);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      console.log(await firstValueFrom(apiGatewayController.getHello()));
      const result = await firstValueFrom(apiGatewayController.getHello());
      expect(result).toBe('Hello World!');
    });
  });
});
