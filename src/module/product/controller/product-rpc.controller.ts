import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from '../service/product.service';
import { type PaginationOptions, ProductMessagePattern } from '../product.type';
import { CreateProductDto } from './create-product.dto';
import { PatchProductDto } from './patch-product.dto';
import { ProductResponseDto } from './product-response.dto';

@Controller()
export class ProductRpcController {
  constructor(private readonly service: ProductService) {}

  @MessagePattern(ProductMessagePattern.INDEX)
  index(@Payload() paginationOptions: PaginationOptions) {
    return this.service.index(paginationOptions);
  }

  @MessagePattern(ProductMessagePattern.CREATE)
  async create(
    @Payload() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.service.create(createProductDto);
  }

  @MessagePattern(ProductMessagePattern.SHOW)
  show(@Payload() id: number): Promise<ProductResponseDto> {
    return this.service.show(id);
  }

  @MessagePattern(ProductMessagePattern.PATCH)
  patch(
    @Payload() payload: PatchProductDto & { id: number },
  ): Promise<ProductResponseDto> {
    return this.service.patch(payload.id, payload);
  }

  @MessagePattern(ProductMessagePattern.DELETE)
  delete(id: number) {
    return this.service.delete(id);
  }
}
