import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength, MaxLength, IsStrongPassword, Matches } from 'class-validator';

export class LoginSellerDto {
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
}
