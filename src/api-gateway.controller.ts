import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PRODUCT_SERVICE_CLIENT } from './config/microservice.config';

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject(PRODUCT_SERVICE_CLIENT) private readonly client: ClientProxy,
  ) {}

  @Get()
  getHello(): Observable<string> {
    return this.client.send('HELLO', {});
  }
}
