import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PRODUCT_SERVICE_CLIENT } from './config/microservice.config';
import { ProductMessagePattern } from './module/product/product.type';
import { CreateProductDto } from './module/product/create-product.dto';

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject(PRODUCT_SERVICE_CLIENT) private readonly client: ClientProxy,
  ) {}

  @Get()
  getHello(): Observable<string> {
    return this.client.send('HELLO', {});
  }

  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Observable<boolean> {
    return this.client.send(ProductMessagePattern.CREATE, createProductDto);
  }
}
