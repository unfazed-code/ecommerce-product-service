import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Unique product token string',
    example: 'product-1',
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.trim())
  productToken: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Product 1',
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) =>
    (value.charAt(0).toUpperCase() + value.slice(1)).trim(),
  )
  name: string;

  @ApiProperty({
    description: 'Product price',
    example: 58.99,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Product stock quantity',
    example: 100,
  })
  @IsInt()
  @Min(0)
  stock: number;
}
