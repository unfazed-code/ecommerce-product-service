import { HttpStatus } from '@nestjs/common';

export enum ProductMessagePattern {
  INDEX = 'product.index',
  CREATE = 'product.create',
  SHOW = 'product.show',
  PATCH = 'product.patch',
  DELETE = 'product.delete',
}

export enum ProductError {
  PRODUCT_TOKEN_ALREADY_EXISTS = 'product_error:token_already_exists',
  PRODUCT_PRICE_CANNOT_BE_NEGATIVE = 'product_error:price_cannot_be_negative',
  PRODUCT_STOCK_CANNOT_BE_NEGATIVE = 'product_error:stock_cannot_be_negative',
  PRODUCT_NOT_FOUND = 'product_error:not_found',
}

export const ProductErrorMapping: Record<ProductError, HttpStatus> = {
  [ProductError.PRODUCT_TOKEN_ALREADY_EXISTS]: HttpStatus.BAD_REQUEST,
  [ProductError.PRODUCT_PRICE_CANNOT_BE_NEGATIVE]: HttpStatus.BAD_REQUEST,
  [ProductError.PRODUCT_STOCK_CANNOT_BE_NEGATIVE]: HttpStatus.BAD_REQUEST,
  [ProductError.PRODUCT_NOT_FOUND]: HttpStatus.NOT_FOUND,
};

export type PaginationOptions = {
  page: number;
  perPage: number;
};
