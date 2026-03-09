import { IsObject } from 'class-validator';

export class ApiResponseDto<T> {
  @IsObject()
  data: T;
}
