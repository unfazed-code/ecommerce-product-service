import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from '../service/product.service';
import { ProductMessagePattern } from '../product.type';
import { CreateProductDto } from './create-product.dto';

@Controller()
export class ProductRpcController {
  constructor(private readonly service: ProductService) {}

  @MessagePattern(ProductMessagePattern.INDEX)
  index() {
    return this.service.index();
  }

  @MessagePattern(ProductMessagePattern.CREATE)
  create(@Payload() createProductDto: CreateProductDto) {
    return this.service.create(createProductDto);
  }

  @MessagePattern(ProductMessagePattern.SHOW)
  show() {
    return this.service.show();
  }

  @MessagePattern(ProductMessagePattern.PATCH)
  patch() {
    return this.service.patch();
  }

  @MessagePattern(ProductMessagePattern.DELETE)
  delete() {
    return this.service.delete();
  }
}
