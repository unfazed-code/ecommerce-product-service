import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductDto } from './create-product.dto';
import { PRODUCT_SERVICE_CLIENT } from 'src/config/microservice.config';
import { ClientProxy } from '@nestjs/microservices';
import { ProductMessagePattern } from '../product.type';
import { PatchProductDto } from './patch-product.dto';

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

  @Patch('/:id')
  patch(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() patchProductDto: PatchProductDto,
  ) {
    return this.client.send(ProductMessagePattern.PATCH, {
      ...patchProductDto,
      id,
    });
  }

  @Delete('/:id')
  delete(@Param('id', new ParseIntPipe()) id: number) {
    return this.client.send(ProductMessagePattern.DELETE, id);
  }
}
