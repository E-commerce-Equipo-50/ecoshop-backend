import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiCustomerRegisterEndpoint = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Registrar nuevo cliente',
      description: 'Crea una nueva cuenta de cliente en el sistema. El email debe ser único y se crea automáticamente un carrito de compras.',
    }),
    ApiResponse({
      status: 201,
      description: 'Cliente registrado exitosamente',
      schema: {
        example: {
          message: 'User registered successfully',
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: '507f1f77bcf86cd799439011',
            email: 'cliente@example.com',
            name: 'Juan Pérez',
            role: 'client',
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
            'name should not be empty',
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

export const ApiCustomerLoginEndpoint = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Iniciar sesión como cliente',
      description: 'Autentica un cliente y devuelve un token JWT. Se verifica que exista un carrito activo.',
    }),
    ApiResponse({
      status: 200,
      description: 'Login exitoso, devuelve token JWT',
      schema: {
        example: {
          message: 'User logged in successfully',
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: '507f1f77bcf86cd799439011',
            email: 'cliente@example.com',
            name: 'Juan Pérez',
            role: 'client',
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
