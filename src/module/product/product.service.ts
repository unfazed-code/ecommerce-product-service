import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../utils/logger.service';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.entity';
import { CreateProductDto } from './create-product.dto';
import { RpcException } from '@nestjs/microservices';
import { ProductError } from './product.type';

@Injectable()
export class ProductService {
  constructor(
    private readonly logger: LoggerService,
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {
    logger.setContext(ProductService.name);
  }

  getHello(): string {
    return 'Hello World!';
  }

  index() {
    return false;
  }

  async create(createProductDto: CreateProductDto) {
    const createdNewProduct = await this.productModel.findOrCreate({
      where: { productToken: createProductDto.productToken },
      defaults: { ...createProductDto },
    });

    if (!createdNewProduct[1]) {
      throw new RpcException(ProductError.PRODUCT_TOKEN_ALREADY_EXISTS);
    }

    return createdNewProduct[0];
  }
  show() {
    return false;
  }
  patch() {
    return false;
  }
  delete() {
    return false;
  }
}
