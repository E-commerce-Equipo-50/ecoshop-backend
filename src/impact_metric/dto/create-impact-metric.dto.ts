import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  IsOptional,
} from 'class-validator';
import type { ImpactMetricType } from '../impact-metric.schema';

export class CreateImpactMetricDto {
  @IsMongoId()
  productId: string;

  @IsEnum(['CO2', 'WATER', 'ENERGY', 'RECYCLED', 'TRANSPORT'])
  type: ImpactMetricType;

  @IsNumber()
  @Min(0)
  value: number;

  // Campo NUEVO para el valor del producto estándar/no sostenible (ej: 5.0 kg CO2e)
  @IsOptional() 
  @IsNumber()
  @Min(0)
  comparison_value?: number; // Hacemos el campo opcional en la clase

  @IsString()
  @MaxLength(50)
  unit: string;
}
