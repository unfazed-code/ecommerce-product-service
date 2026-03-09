import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../model/product.entity';
import { ProductService } from './product.service';
import { CreateProductDto } from '../controller/create-product.dto';
import { LoggerService } from '../../../utils/logger.service';
import { getModelToken } from '@nestjs/sequelize';
import { ProductError } from '../product.type';

let app: TestingModule;

describe('ProductService', () => {
  let service: ProductService;
  let productModel: typeof Product;

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
            debug: jest.fn(),
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
    const createProductDto: CreateProductDto = {
      name: 'New product',
      price: 10,
      stock: 50,
      productToken: 'new-token',
    };
    const mockProduct = { id: 1, ...createProductDto };
    productModel.findOrCreate = jest
      .fn()
      .mockResolvedValue([mockProduct, true]);

    const result = await service.create(createProductDto);

    expect(result).toEqual(mockProduct);
  });

  it('CREATE: should throw RpcException if product token already exists', async () => {
    const createProductDto = {
      name: 'Existing product',
      price: 10,
      stock: 50,
      productToken: 'existing-token',
    };
    productModel.findOrCreate = jest.fn().mockResolvedValue([{}, false]);

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
    const product = {
      id: 1,
      name: 'product',
      price: 10,
      stock: 50,
      productToken: 'product-token',
    };
    productModel.findOne = jest.fn().mockResolvedValue(product);

    const result = service.show(product.id);
    await expect(result).resolves.toEqual(product);
  });

  it('SHOW: should throw a not_found exception if product id not present in database', async () => {
    productModel.findOne = jest.fn().mockResolvedValue(null);

    const result = service.show(20);
    await expect(result).rejects.toThrow(ProductError.PRODUCT_NOT_FOUND);
  });

  it('PATCH: should throw a not_found exception if product id not present in database', async () => {
    productModel.findOne = jest.fn().mockResolvedValue(null);

    const result = service.patch(1, { stock: 50 });
    await expect(result).rejects.toThrow(ProductError.PRODUCT_NOT_FOUND);
  });

  it('PATCH: should update a product stock', async () => {
    const product = {
      id: 1,
      name: 'product',
      price: 10,
      stock: 50,
      productToken: 'product-token',
      update: jest.fn(),
    };
    productModel.findOne = jest.fn().mockResolvedValue(product);

    await service.patch(product.id, { stock: 42 });
    expect(product.update).toHaveBeenCalledWith(
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
});
