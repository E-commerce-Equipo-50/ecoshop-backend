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

export const ApiCreateOrderEndpoint = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Crear orden desde el carrito',
      description: 'Convierte el carrito de compras activo en una orden. Calcula el total y las métricas de impacto ambiental. Requiere autenticación y rol de cliente.',
    }),
    ApiResponse({
      status: 201,
      description: 'Orden creada exitosamente',
      schema: {
        example: {
          message: 'Orden creada correctamente',
          order: {
            id: '507f1f77bcf86cd799439011',
            status: 'pending',
            total: 89.97,
            items: [
              {
                id: '507f1f77bcf86cd799439012',
                product: {
                  id: '507f1f77bcf86cd799439013',
                  name: 'Producto Sostenible',
                  brand: 'EcoBrand',
                  price: 29.99,
                },
                quantity: 3,
                unitPrice: 29.99,
                subtotal: 89.97,
              },
            ],
          },
          impactSummary: {
            totalCarbonFootprint: 7.5,
            totalWaterUsage: 450,
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Carrito vacío o productos sin stock',
    }),
    ApiUnauthorizedResponse({
      description: 'Token JWT inválido o expirado',
    }),
    ApiForbiddenResponse({
      description: 'Usuario no tiene permisos de cliente',
    }),
    ApiNotFoundResponse({
      description: 'Carrito activo no encontrado',
    }),
  );
};

export const ApiListOrdersEndpoint = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Listar mis órdenes',
      description: 'Devuelve todas las órdenes del cliente autenticado con sus items y métricas de impacto. Requiere autenticación y rol de cliente.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de órdenes obtenida exitosamente',
      schema: {
        example: {
          orders: [
            {
              id: '507f1f77bcf86cd799439011',
              status: 'pending',
              total: 89.97,
              createdAt: '2025-12-02T10:00:00.000Z',
              items: [
                {
                  id: '507f1f77bcf86cd799439012',
                  product: {
                    id: '507f1f77bcf86cd799439013',
                    name: 'Producto Sostenible',
                    brand: 'EcoBrand',
                    price: 29.99,
                  },
                  quantity: 3,
                  unitPrice: 29.99,
                  subtotal: 89.97,
                },
              ],
              impactSummary: {
                totalCarbonFootprint: 7.5,
                totalWaterUsage: 450,
              },
            },
          ],
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Token JWT inválido o expirado',
    }),
    ApiForbiddenResponse({
      description: 'Usuario no tiene permisos de cliente',
    }),
  );
};
