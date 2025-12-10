import { IsEnum, IsOptional, IsString, MaxLength, IsUrl } from 'class-validator';
import type { CertificationType } from '../certification.schema';

export class UpdateCertificationDto {
  @IsEnum(['FAIR_TRADE', 'CARBON_NEUTRAL', 'GOTS'])
  @IsOptional()
  type?: CertificationType;

  @IsString()
  @IsUrl()
  @MaxLength(2048)
  @IsOptional()
  iconUrl?: string;
}
