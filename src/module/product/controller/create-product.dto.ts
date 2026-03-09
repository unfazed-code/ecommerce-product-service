import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.trim())
  productToken: string;

  @IsNotEmpty()
  @Transform(({ value }: { value: string }) =>
    (value.charAt(0).toUpperCase() + value.slice(1)).trim(),
  )
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;
}
