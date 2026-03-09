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
}

export const ProductErrorMapping: Record<ProductError, HttpStatus> = {
  [ProductError.PRODUCT_TOKEN_ALREADY_EXISTS]: HttpStatus.BAD_REQUEST,
};
