import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT de autenticación',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    type: 'object',
    properties: {
      id: { type: 'string', example: '507f1f77bcf86cd799439011' },
      email: { type: 'string', example: 'user@ecoshop.com' },
      role: { type: 'string', example: 'client' },
      name: { type: 'string', example: 'Juan Pérez' },
    },
  })
  user: {
    id: string;
    email: string;
    role: string;
    name?: string;
  };
}

export class UserProfileDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'user@ecoshop.com',
  })
  email: string;

  @ApiProperty({
    description: 'Rol del usuario',
    example: 'client',
    enum: ['client', 'admin'],
  })
  role: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez',
    required: false,
  })
  name?: string;
}
