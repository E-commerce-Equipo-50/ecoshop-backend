// src/stripe/dto/create-payment-intent.dto.ts
import { IsInt, IsOptional, IsString, Min, IsObject } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsInt()
  @Min(1)
  amount!: number; // cents

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, string>;
}
