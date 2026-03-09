import { Catch, HttpStatus, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import {
  ProductError,
  ProductErrorMapping,
} from 'src/module/product/product.type';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException): Observable<any> {
    const error = exception.getError();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    if (
      typeof error === 'string' &&
      Object.keys(ProductErrorMapping).some((val) => val === error)
    ) {
      statusCode = ProductErrorMapping[error as ProductError];
    }

    return throwError(() => ({
      statusCode,
      error: error,
      message: [error],
      timestamp: new Date().toISOString(),
    }));
  }
}
