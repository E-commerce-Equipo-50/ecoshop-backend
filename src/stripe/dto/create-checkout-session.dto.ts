// src/stripe/dto/create-checkout-session.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsOptional, IsString, ValidateNested, IsUrl } from 'class-validator';
import { CreateCheckoutItemDto } from './create-checkout-item.dto';

export class CreateCheckoutSessionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCheckoutItemDto)
  items!: CreateCheckoutItemDto[];

  @IsString()
  @IsUrl({ require_tld: false })
  successUrl!: string;

  @IsString()
  @IsUrl({ require_tld: false })
  cancelUrl!: string;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;
}
