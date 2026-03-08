import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
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
