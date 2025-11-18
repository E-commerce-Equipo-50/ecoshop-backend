import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength, Matches, MaxLength, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'user@ecoshop.com',
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
    description: 'Contraseña del usuario (mín. 10 caracteres, debe incluir mayúsculas, minúsculas, números y símbolos)',
    example: 'MyP@ssw0rd123!',
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
}
