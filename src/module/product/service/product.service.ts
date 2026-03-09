import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../../utils/logger.service';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../model/product.entity';
import { CreateProductDto } from '../controller/create-product.dto';
import { RpcException } from '@nestjs/microservices';
import { ProductError } from '../product.type';
import { PatchProductDto } from '../controller/patch-product.dto';

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
    this.logger.debug(
      `||> creating product ${JSON.stringify(createProductDto)}`,
    );

    if (createProductDto.price < 0) {
      throw new RpcException(ProductError.PRODUCT_PRICE_CANNOT_BE_NEGATIVE);
    }
    if (createProductDto.stock < 0) {
      throw new RpcException(ProductError.PRODUCT_STOCK_CANNOT_BE_NEGATIVE);
    }

    const createdNewProduct = await this.productModel.findOrCreate({
      where: { productToken: createProductDto.productToken },
      defaults: {
        ...createProductDto,
        name: createProductDto.name.trim(),
        productToken: createProductDto.productToken.trim(),
      },
    });

    if (!createdNewProduct[1]) {
      throw new RpcException(ProductError.PRODUCT_TOKEN_ALREADY_EXISTS);
    }

    return createdNewProduct[0];
  }

  async show(id: number) {
    this.logger.debug(`||> showing product ${id}`);

    const product = await this.productModel.findOne({
      where: { id },
    });

    if (!product) {
      throw new RpcException(ProductError.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  async patch(id: number, patchProductDto: PatchProductDto) {
    this.logger.debug(
      `||> updating product ${id} stock ${JSON.stringify(patchProductDto)}`,
    );

    const product = await this.productModel.findOne({
      where: { id: id },
    });

    if (!product) {
      throw new RpcException(ProductError.PRODUCT_NOT_FOUND);
    }

    return await product.update({ stock: patchProductDto.stock });
  }

  async delete(id: number) {
    this.logger.debug(`||> deleting product ${id}`);

    const product = await this.productModel.findOne({
      where: { id: id },
    });

    if (!product) {
      throw new RpcException(ProductError.PRODUCT_NOT_FOUND);
    }

    return await product.destroy();
  }
}
