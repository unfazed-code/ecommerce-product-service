import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from '../service/product.service';
import { ProductMessagePattern } from '../product.type';
import { CreateProductDto } from './create-product.dto';
import { PatchProductDto } from './patch-product.dto';

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
  show(@Payload() id: number) {
    return this.service.show(id);
  }

  @MessagePattern(ProductMessagePattern.PATCH)
  patch(@Payload() payload: PatchProductDto & { id: number }) {
    return this.service.patch(payload.id, payload);
  }

  @MessagePattern(ProductMessagePattern.DELETE)
  delete(id: number) {
    return this.service.delete(id);
  }
}
