import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../model/product.entity';
import { ProductService } from './product.service';
import { LoggerService } from '../../../utils/logger.service';
import { getModelToken } from '@nestjs/sequelize';
import { ProductError } from '../product.type';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductResponseDto } from '../dto/product-response.dto';

let app: TestingModule;

describe('ProductService', () => {
  let service: ProductService;
  let productModel: typeof Product;

  const createProductDto: CreateProductDto = {
    name: 'New product',
    price: 10,
    stock: 50,
    productToken: 'new-token',
  };
  const productResponseDto: ProductResponseDto = {
    id: 1,
    ...createProductDto,
    price: createProductDto.price,
    createdAt: new Date('2026-03-11'),
    updatedAt: new Date('2026-03-11'),
  };

  const productGetMethodMock = jest.fn((key: keyof ProductResponseDto) => {
    const values: Record<keyof ProductResponseDto, unknown> =
      productResponseDto;
    return values[key];
  });
  const mockProduct = {
    get: productGetMethodMock,
    update: jest.fn(() => {
      return {
        get: productGetMethodMock,
      };
    }),
  };

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        ProductService,
        {
          provide: getModelToken(Product),
          useValue: {
            findOrCreate: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            setContext: jest.fn(),
            debug: jest.fn((el) => console.log(el)),
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = app.get(ProductService);
    productModel = app.get(getModelToken(Product));
  });

  afterEach(async () => {
    await app.close();
  });

  it('CREATE: should create a new product if token does not exist', async () => {
    productModel.findOrCreate = jest
      .fn()
      .mockResolvedValue([mockProduct, true]);

    const result = await service.create(createProductDto);

    expect(result).toEqual(productResponseDto);
  });

  it('CREATE: should throw RpcException if product token already exists', async () => {
    productModel.findOrCreate = jest.fn().mockResolvedValue([null, false]);

    await expect(service.create(createProductDto)).rejects.toThrow(
      ProductError.PRODUCT_TOKEN_ALREADY_EXISTS,
    );
  });

  it('CREATE: should throw RpcException if product price < 0', async () => {
    const createProductDto = {
      name: 'product',
      price: -10,
      stock: 50,
      productToken: 'product-token',
    };
    productModel.findOrCreate = jest.fn().mockResolvedValue([{}, true]);

    const result = service.create(createProductDto);
    await expect(result).rejects.toThrow(
      ProductError.PRODUCT_PRICE_CANNOT_BE_NEGATIVE,
    );
  });

  it('CREATE: should throw RpcException if product stock < 0', async () => {
    const createProductDto = {
      name: 'product',
      price: 10,
      stock: -50,
      productToken: 'product-token',
    };
    productModel.findOrCreate = jest.fn().mockResolvedValue([{}, true]);

    const result = service.create(createProductDto);
    await expect(result).rejects.toThrow(
      ProductError.PRODUCT_STOCK_CANNOT_BE_NEGATIVE,
    );
  });

  it('SHOW: should find a product by id if present in database', async () => {
    productModel.findOne = jest.fn().mockResolvedValue(mockProduct);

    const result = service.show(productResponseDto.id);
    await expect(result).resolves.toEqual(productResponseDto);
  });

  it('SHOW: should throw a not_found exception if product id not present in database', async () => {
    productModel.findOne = jest.fn().mockResolvedValue(null);

    const result = service.show(20);
    await expect(result).rejects.toThrow(ProductError.PRODUCT_NOT_FOUND);
  });

  it('PATCH: should throw a not_found exception if product id not present in database', async () => {
    productModel.findOne = jest.fn().mockResolvedValue(null);

    const result = service.patch(productResponseDto.id, { stock: 50 });
    await expect(result).rejects.toThrow(ProductError.PRODUCT_NOT_FOUND);
  });

  it('PATCH: should update a product stock', async () => {
    productModel.findOne = jest.fn().mockResolvedValue(mockProduct);

    await service.patch(productResponseDto.id, { stock: 42 });
    expect(mockProduct.update).toHaveBeenCalledWith(
      expect.objectContaining({ stock: 42 }),
    );
  });

  it('DELETE: should throw a not_found exception if product id not present in database', async () => {
    productModel.findOne = jest.fn().mockResolvedValue(null);

    const result = service.delete(1);
    await expect(result).rejects.toThrow(ProductError.PRODUCT_NOT_FOUND);
  });

  it('DELETE: should delete a product', async () => {
    const product = {
      id: 1,
      name: 'product',
      price: 10,
      stock: 50,
      productToken: 'product-token',
      destroy: jest.fn(),
    };
    productModel.findOne = jest.fn().mockResolvedValue(product);

    await service.delete(product.id);
    expect(product.destroy).toHaveBeenCalled();
  });

  it('INDEX: should list products with pagination data', async () => {
    const products = Array(10).map((id: number) => ({
      id,
      name: `product-${id}`,
      price: 10,
      stock: 50,
      productToken: `product-token-${id}`,
    }));
    productModel.findAndCountAll = jest
      .fn()
      .mockResolvedValue({ count: 50, rows: products });

    const result = await service.index({ page: 1, perPage: 10 });
    expect(result.data.length).toBe(10);
    expect(result.currentPage).toBe(1);
    expect(result.previousPage).toBe(null);
    expect(result.nextPage).toBe(2);
    expect(result.count).toBe(50);
    expect(result.perPage).toBe(10);
  });
});
