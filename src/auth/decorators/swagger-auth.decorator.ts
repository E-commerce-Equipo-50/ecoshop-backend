import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthResponseDto, UserProfileDto } from '../dto/auth-response.dto';

export const ApiRegisterEndpoint = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Registrar nuevo usuario',
      description: 'Crea una nueva cuenta de usuario en el sistema. El email debe ser único y la contraseña debe cumplir con los requisitos de seguridad.',
    }),
    ApiResponse({
      status: 201,
      description: 'Usuario registrado exitosamente',
      type: AuthResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos o contraseña débil',
      schema: {
        example: {
          statusCode: 400,
          message: [
            'email must be a valid address with a domain',
            'password must include upper and lower case letters, numbers, and special characters',
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
          message: 'Email already exists',
          error: 'Conflict',
        },
      },
    }),
  );
};

export const ApiLoginEndpoint = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Iniciar sesión',
      description: 'Autentica un usuario y devuelve un token JWT válido por 24 horas.',
    }),
    ApiResponse({
      status: 200,
      description: 'Login exitoso, devuelve token JWT',
      type: AuthResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos',
      schema: {
        example: {
          statusCode: 400,
          message: ['email must be a valid email', 'password must be a string'],
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

export const ApiProfileEndpoint = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Obtener perfil del usuario',
      description: 'Devuelve la información del usuario autenticado mediante el token JWT.',
    }),
    ApiResponse({
      status: 200,
      description: 'Perfil del usuario obtenido exitosamente',
      type: UserProfileDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Token JWT inválido o expirado',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      },
    }),
  );
};
