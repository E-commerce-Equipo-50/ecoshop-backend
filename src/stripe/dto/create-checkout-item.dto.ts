// src/stripe/dto/create-checkout-item.dto.ts
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateCheckoutItemDto {
    @IsString()
    name!: string;

    @IsInt()
    @Min(1)
    unit_amount!: number; // cents

    @IsOptional()
    @IsInt()
    @Min(1)
    quantity?: number;

    @IsOptional()
    @IsString()
    currency?: string;
}
