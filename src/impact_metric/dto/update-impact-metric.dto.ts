import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import type { ImpactMetricType } from '../impact-metric.schema';

export class UpdateImpactMetricDto {
  @IsEnum(['CO2', 'WATER', 'ENERGY', 'RECYCLED', 'TRANSPORT'])
  @IsOptional()
  type?: ImpactMetricType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  value?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  comparison_value?: number;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  unit?: string;
}
