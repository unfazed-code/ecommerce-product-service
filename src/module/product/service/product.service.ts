import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../../utils/logger.service';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../model/product.entity';
import { CreateProductDto } from '../controller/create-product.dto';
import { RpcException } from '@nestjs/microservices';
import { ProductError } from '../product.type';

@Injectable()
export class ProductService {
  constructor(
    private readonly logger: LoggerService,
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {
    logger.setContext(ProductService.name);
  }

  index() {
    return false;
  }

  async create(createProductDto: CreateProductDto) {
    if (createProductDto.price < 0) {
      throw new RpcException(ProductError.PRODUCT_PRICE_CANNOT_BE_NEGATIVE);
    }
    if (createProductDto.stock < 0) {
      throw new RpcException(ProductError.PRODUCT_STOCK_CANNOT_BE_NEGATIVE);
    }

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
