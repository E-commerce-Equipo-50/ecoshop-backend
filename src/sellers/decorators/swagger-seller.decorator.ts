import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiSellerRegisterEndpoint = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Registrar nuevo vendedor',
      description: 'Crea una nueva cuenta de vendedor/marca en el sistema. El email debe ser único.',
    }),
    ApiResponse({
      status: 201,
      description: 'Vendedor registrado exitosamente',
      schema: {
        example: {
          message: 'Seller registered successfully',
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          seller: {
            id: '507f1f77bcf86cd799439011',
            email: 'vendedor@ecobrand.com',
            brandName: 'EcoBrand',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos',
      schema: {
        example: {
          statusCode: 400,
          message: [
            'email must be a valid email',
            'password must be at least 8 characters',
            'brandName should not be empty',
          ],
          error: 'Bad Request',
        },
      },
    }),
    ApiConflictResponse({
      description: 'El email ya está registrado',
      schema: {
        example: {
          statusCode: 409,
          message: 'Email already in use',
          error: 'Conflict',
        },
      },
    }),
  );
};

export const ApiSellerLoginEndpoint = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Iniciar sesión como vendedor',
      description: 'Autentica un vendedor/marca y devuelve un token JWT.',
    }),
    ApiResponse({
      status: 200,
      description: 'Login exitoso, devuelve token JWT',
      schema: {
        example: {
          message: 'Seller logged in successfully',
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          seller: {
            id: '507f1f77bcf86cd799439011',
            email: 'vendedor@ecobrand.com',
            brandName: 'EcoBrand',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos',
      schema: {
        example: {
          statusCode: 400,
          message: ['email must be a valid email', 'password should not be empty'],
          error: 'Bad Request',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Credenciales incorrectas',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid credentials',
          error: 'Unauthorized',
        },
      },
    }),
  );
};
