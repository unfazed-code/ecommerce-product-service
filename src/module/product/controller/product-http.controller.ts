import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateProductDto } from './create-product.dto';
import { PRODUCT_SERVICE_CLIENT } from 'src/config/microservice.config';
import { ClientProxy } from '@nestjs/microservices';
import { ProductMessagePattern } from '../product.type';

@Controller('products')
export class ProductHttpController {
  constructor(
    @Inject(PRODUCT_SERVICE_CLIENT) private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.client.send(ProductMessagePattern.CREATE, createProductDto);
  }

  @Get('/:id')
  show(@Param('id', new ParseIntPipe()) id: number) {
    return this.client.send(ProductMessagePattern.SHOW, id);
  }
}
