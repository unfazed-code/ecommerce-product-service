import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product id',
    example: '1',
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'Product name',
    example: 'Product 1',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Unique product token string',
    example: 'product-1',
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.trim())
  productToken: string;

  @ApiProperty({
    description: 'Product price',
    example: 58.99,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Product stock quantity',
    example: 100,
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Product creation date',
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Product last update date',
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export type ProductPaginationResponse = {
  data: ProductResponseDto[];
  count: number;
  currentPage: number;
  perPage: number;
  previousPage: number | null;
  nextPage: number | null;
  totalPages: number;
};
