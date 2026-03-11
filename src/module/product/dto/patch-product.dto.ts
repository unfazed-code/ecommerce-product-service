import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class PatchProductDto {
  @ApiProperty({
    description: 'Product stock >= 0',
    example: '10',
  })
  @IsInt()
  @Min(0)
  stock: number;
}
