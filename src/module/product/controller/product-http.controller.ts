import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './create-product.dto';
import { PRODUCT_SERVICE_CLIENT } from 'src/config/microservice.config';
import { ClientProxy } from '@nestjs/microservices';
import { PaginationOptions, ProductMessagePattern } from '../product.type';
import { PatchProductDto } from './patch-product.dto';
import { ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';

@Controller('products')
export class ProductHttpController {
  constructor(
    @Inject(PRODUCT_SERVICE_CLIENT) private readonly client: ClientProxy,
  ) {}

  @Get()
  @ApiQuery({
    type: Number,
    name: 'page',
    description: 'pagination page parameter (integer >= 1)',
    minimum: 1,
    required: false,
  })
  @ApiQuery({
    type: Number,
    name: 'perPage',
    minimum: 1,
    description: 'pagination perPage parameter (integer >= 1)',
    required: false,
  })
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
  ) {
    const paginationOptions: PaginationOptions = {
      page: page,
      perPage: perPage,
    };
    return this.client.send(ProductMessagePattern.INDEX, paginationOptions);
  }

  @Post()
  @ApiBody({
    type: CreateProductDto,
    description: 'Payload for product creation',
  })
  @ApiResponse({ type: ProductResponseDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.client.send(ProductMessagePattern.CREATE, createProductDto);
  }

  @Get('/:id')
  @ApiParam({ type: Number, name: 'id', description: 'Product id' })
  @ApiResponse({ type: ProductResponseDto })
  show(@Param('id', new ParseIntPipe()) id: number) {
    return this.client.send(ProductMessagePattern.SHOW, id);
  }

  @Patch('/:id')
  @ApiParam({ type: Number, name: 'id', description: 'Product id' })
  @ApiBody({
    type: PatchProductDto,
    description: 'Payload for product creation',
  })
  @ApiResponse({ type: ProductResponseDto })
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
  @ApiParam({ type: Number, name: 'id', description: 'Product id' })
  delete(@Param('id', new ParseIntPipe()) id: number) {
    return this.client.send(ProductMessagePattern.DELETE, id);
  }
}
