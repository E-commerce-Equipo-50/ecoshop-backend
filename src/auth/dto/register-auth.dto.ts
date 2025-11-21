import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsStrongPassword,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const USER_ROLES = ['admin', 'client'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export class RegisterAuthDto {
  @ApiProperty({
    description: 'Email del usuario (se convertirá a minúsculas automáticamente)',
    example: 'newuser@ecoshop.com',
    format: 'email',
    minLength: 5,
    maxLength: 255,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  @Matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, {
    message: 'email must be a valid address with a domain',
  })
  email: string;

  @ApiProperty({
    description: 'Contraseña segura (mín. 10 caracteres, debe incluir mayúsculas, minúsculas, números y símbolos)',
    example: 'SecureP@ss123!',
    minLength: 10,
    maxLength: 64,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(64)
  @IsStrongPassword(
    {
      minLength: 10,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'password must include upper and lower case letters, numbers, and special characters',
    },
  )
  password: string;

  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    maxLength: 60,
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  name?: string;

  @ApiPropertyOptional({
    description: 'Rol del usuario en el sistema',
    enum: USER_ROLES,
    default: 'client',
    example: 'client',
  })
  @IsOptional()
  @IsIn(USER_ROLES)
  role?: UserRole;
}
