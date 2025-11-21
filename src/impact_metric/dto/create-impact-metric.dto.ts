import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsString,
  MaxLength,
  Min,
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

  @IsString()
  @MaxLength(50)
  unit: string;
}
