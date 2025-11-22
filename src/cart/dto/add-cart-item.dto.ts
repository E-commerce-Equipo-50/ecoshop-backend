import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, Min, IsNumber } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({
    description: 'Identificador del producto a agregar al carrito',
    example: '6766f0dcf1a0c2e7d8d6d123',
  })
  @IsMongoId()
  productId: string;

  @ApiPropertyOptional({
    description: 'Cantidad del producto',
    example: 2,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;
}
