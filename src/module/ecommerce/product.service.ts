import { Injectable } from '@nestjs/common';
import { EcommerceLoggerService } from './logger.service';

@Injectable()
export class ProductService {
  constructor(private readonly logger: EcommerceLoggerService) {
    logger.setContext(ProductService.name);
  }

  getHello(): string {
    return 'Hello World!';
  }

  index() {
    return false;
  }
  create() {
    return false;
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
