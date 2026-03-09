import { IsInt, Min } from 'class-validator';

export class PatchProductDto {
  @IsInt()
  @Min(0)
  stock: number;
}
