import { IsIn, IsMongoId, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';
import type { CertificationType } from '../certification.schema';

const CERT_TYPES: CertificationType[] = [
  'FAIR_TRADE',
  'CARBON_NEUTRAL',
  'GOTS',
];

export class CreateCertificationDto {
  @IsMongoId()
  productId: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsIn(CERT_TYPES)
  type: CertificationType;

  @IsString()
  @IsUrl()
  iconUrl: string;
}
