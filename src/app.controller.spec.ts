import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ecommerceClientProxyConfig } from './config/microservice.config';
import { ClientsModule } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

let app: TestingModule;

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [ClientsModule.register([ecommerceClientProxyConfig])],
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      console.log(await firstValueFrom(appController.getHello()));
      const result = await firstValueFrom(appController.getHello());
      expect(result).toBe('Hello World!');
    });
  });
});
