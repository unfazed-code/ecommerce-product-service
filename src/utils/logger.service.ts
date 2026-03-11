import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  constructor() {
    super();
    this.context = LoggerService.name;
  }

  setContext(context: string) {
    this.context = context;
  }
}
