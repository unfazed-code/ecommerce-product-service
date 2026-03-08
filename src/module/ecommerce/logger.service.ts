import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EcommerceLoggerService extends Logger {
  constructor() {
    super();
    this.context = EcommerceLoggerService.name;
  }

  setContext(context: string) {
    this.context = context;
  }
}
