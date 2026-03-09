import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../../utils/logger.service';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../model/product.entity';
import { CreateProductDto } from '../controller/create-product.dto';
import { RpcException } from '@nestjs/microservices';
import { type PaginationOptions, ProductError } from '../product.type';
import { PatchProductDto } from '../controller/patch-product.dto';
import { ProductResponseDto } from '../controller/product-response.dto';
import { NOW } from 'sequelize';

@Injectable()
export class ProductService {
  constructor(
    private readonly logger: LoggerService,
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {
    logger.setContext(ProductService.name);
  }

  async index(paginationOptions: PaginationOptions) {
    this.logger.debug(`||> reading paginated products`);

    const page = Math.max(1, paginationOptions.page);
    const perPage = Math.max(1, paginationOptions.perPage);
    const offset = (page - 1) * perPage;

    const { count, rows: products } = await this.productModel.findAndCountAll({
      limit: perPage,
      offset,
    });

    const hasNextPage = count > offset + perPage;
    const nextPage = hasNextPage ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;

    return {
      data: products,
      count,
      currentPage: page,
      perPage,
      previousPage,
      nextPage,
      totalPages: Math.ceil(count / perPage),
    };
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
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

    return this.buildProductResponseDto(createdNewProduct[0]);
  }

  async show(id: number) {
    this.logger.debug(`||> showing product ${id}`);

    const product = await this.productModel.findOne({
      where: { id },
    });

    if (!product) {
      throw new RpcException(ProductError.PRODUCT_NOT_FOUND);
    }

    return this.buildProductResponseDto(product);
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

    const updatedProduct = await product.update({
      stock: patchProductDto.stock,
      updatedAt: NOW,
    });
    return this.buildProductResponseDto(updatedProduct);
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

  private buildProductResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.get('id') as number,
      name: product.get('name'),
      productToken: product.get('productToken'),
      price: product.get('price'),
      stock: product.get('stock'),
      createAt: product.get('createdAt') as Date,
      updatedAt: product.get('updatedAt') as Date,
    };
  }
}
