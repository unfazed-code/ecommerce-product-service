import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  async canActivate(context: ExecutionContext) {
    const ctxType = context.getType();

    if (ctxType === 'rpc') return true;

    return await super.canActivate(context);
  }
}
