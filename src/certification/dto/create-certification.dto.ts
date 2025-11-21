import { IsEnum, IsMongoId, IsString, IsUrl } from 'class-validator';
import type { CertificationType } from '../certification.schema';

export class CreateCertificationDto {
  @IsMongoId()
  productId: string;

  @IsEnum(['FAIR_TRADE', 'CARBON_NEUTRAL', 'GOTS'])
  type: CertificationType;

  @IsString()
  @IsUrl()
  iconUrl: string;
}
