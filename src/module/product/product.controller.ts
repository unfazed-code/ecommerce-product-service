import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { ProductMessagePattern } from './product.type';

@Controller()
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @MessagePattern('HELLO')
  getHello() {
    return this.service.getHello();
  }

  @MessagePattern(ProductMessagePattern.INDEX)
  index() {
    return this.service.index();
  }

  @MessagePattern(ProductMessagePattern.CREATE)
  create() {
    return this.service.create();
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
