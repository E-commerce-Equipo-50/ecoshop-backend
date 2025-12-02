import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// PartialType hace que todas las propiedades de CreateProductDto sean opcionales
export class UpdateProductDto extends PartialType(CreateProductDto) {}