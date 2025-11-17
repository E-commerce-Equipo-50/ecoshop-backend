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

const USER_ROLES = ['admin', 'client'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export class RegisterAuthDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  @Matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, {
    message: 'email must be a valid address with a domain',
  })
  email: string;

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

  @IsOptional()
  @IsString()
  @MaxLength(60)
  name?: string;

  @IsOptional()
  @IsIn(USER_ROLES)
  role?: UserRole;
}
