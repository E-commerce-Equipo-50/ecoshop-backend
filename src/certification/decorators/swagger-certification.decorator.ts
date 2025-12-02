import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export const ApiCreateCertificationEndpoint = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Crear certificación',
      description: 'Permite a un vendedor agregar una certificación a uno de sus productos. Requiere autenticación y rol de seller.',
    }),
    ApiResponse({
      status: 201,
      description: 'Certificación creada exitosamente',
      schema: {
        example: {
          message: 'Certification created',
          certification: {
            id: '507f1f77bcf86cd799439011',
            product: '507f1f77bcf86cd799439012',
            type: 'organic',
            iconUrl: 'https://example.com/icon.svg',
            createdAt: '2025-12-02T10:00:00.000Z',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos',
    }),
    ApiUnauthorizedResponse({
      description: 'Token JWT inválido o expirado',
    }),
    ApiForbiddenResponse({
      description: 'Usuario no tiene permisos de vendedor o el producto no le pertenece',
    }),
  );
};

export const ApiListCertificationsByProductEndpoint = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar certificaciones de un producto',
      description: 'Devuelve todas las certificaciones asociadas a un producto. No requiere autenticación.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de certificaciones obtenida exitosamente',
      schema: {
        example: {
          certifications: [
            {
              id: '507f1f77bcf86cd799439011',
              product: '507f1f77bcf86cd799439012',
              type: 'organic',
              iconUrl: 'https://example.com/icon.svg',
              createdAt: '2025-12-02T10:00:00.000Z',
            },
          ],
        },
      },
    }),
  );
};

export const ApiUpdateCertificationEndpoint = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Actualizar certificación',
      description: 'Permite a un vendedor actualizar una certificación de sus productos. Requiere autenticación y rol de seller.',
    }),
    ApiResponse({
      status: 200,
      description: 'Certificación actualizada exitosamente',
      schema: {
        example: {
          message: 'Certification updated',
          certification: {
            id: '507f1f77bcf86cd799439011',
            product: '507f1f77bcf86cd799439012',
            type: 'fair-trade',
            iconUrl: 'https://example.com/new-icon.svg',
            updatedAt: '2025-12-02T11:00:00.000Z',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos',
    }),
    ApiUnauthorizedResponse({
      description: 'Token JWT inválido o expirado',
    }),
    ApiForbiddenResponse({
      description: 'Usuario no tiene permisos de vendedor o el producto no le pertenece',
    }),
    ApiNotFoundResponse({
      description: 'Certificación no encontrada',
    }),
  );
};

export const ApiDeleteCertificationEndpoint = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Eliminar certificación',
      description: 'Permite a un vendedor eliminar una certificación de sus productos. Requiere autenticación y rol de seller.',
    }),
    ApiResponse({
      status: 200,
      description: 'Certificación eliminada exitosamente',
      schema: {
        example: {
          message: 'Certification removed',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Token JWT inválido o expirado',
    }),
    ApiForbiddenResponse({
      description: 'Usuario no tiene permisos de vendedor o el producto no le pertenece',
    }),
    ApiNotFoundResponse({
      description: 'Certificación no encontrada',
    }),
  );
};
