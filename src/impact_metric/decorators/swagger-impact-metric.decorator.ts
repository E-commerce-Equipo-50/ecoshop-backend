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

export const ApiCreateImpactMetricEndpoint = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Crear métrica de impacto',
      description: 'Permite a un vendedor agregar una métrica de impacto ambiental a uno de sus productos. Requiere autenticación y rol de seller.',
    }),
    ApiResponse({
      status: 201,
      description: 'Métrica de impacto creada exitosamente',
      schema: {
        example: {
          message: 'Impact metric created',
          metric: {
            id: '507f1f77bcf86cd799439011',
            product: '507f1f77bcf86cd799439012',
            type: 'CO2',
            value: 1.5,
            comparison_value: 5.0,
            unit: 'kg CO2e',
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

export const ApiListImpactMetricsByProductEndpoint = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar métricas de impacto de un producto',
      description: 'Devuelve todas las métricas de impacto ambiental asociadas a un producto. No requiere autenticación.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de métricas de impacto obtenida exitosamente',
      schema: {
        example: {
          metrics: [
            {
              id: '507f1f77bcf86cd799439011',
              product: '507f1f77bcf86cd799439012',
              type: 'CO2',
              value: 1.5,
              comparison_value: 5.0,
              unit: 'kg CO2e',
              createdAt: '2025-12-02T10:00:00.000Z',
            },
            {
              id: '507f1f77bcf86cd799439013',
              product: '507f1f77bcf86cd799439012',
              type: 'WATER',
              value: 50,
              comparison_value: 200,
              unit: 'litros',
              createdAt: '2025-12-02T10:00:00.000Z',
            },
          ],
        },
      },
    }),
  );
};

export const ApiUpdateImpactMetricEndpoint = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Actualizar métrica de impacto',
      description: 'Permite a un vendedor actualizar una métrica de impacto de sus productos. Requiere autenticación y rol de seller.',
    }),
    ApiResponse({
      status: 200,
      description: 'Métrica de impacto actualizada exitosamente',
      schema: {
        example: {
          message: 'Impact metric updated',
          metric: {
            id: '507f1f77bcf86cd799439011',
            product: '507f1f77bcf86cd799439012',
            type: 'CO2',
            value: 1.5,
            comparison_value: 5.0,
            unit: 'kg CO2e',
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
      description: 'Métrica de impacto no encontrada',
    }),
  );
};

export const ApiDeleteImpactMetricEndpoint = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Eliminar métrica de impacto',
      description: 'Permite a un vendedor eliminar una métrica de impacto de sus productos. Requiere autenticación y rol de seller.',
    }),
    ApiResponse({
      status: 200,
      description: 'Métrica de impacto eliminada exitosamente',
      schema: {
        example: {
          message: 'Impact metric removed',
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
      description: 'Métrica de impacto no encontrada',
    }),
  );
};
