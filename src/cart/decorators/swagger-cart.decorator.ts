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

export const ApiAddToCartEndpoint = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Agregar producto al carrito',
      description: 'Permite a un cliente agregar un producto a su carrito de compras. Requiere autenticación y rol de cliente.',
    }),
    ApiResponse({
      status: 201,
      description: 'Producto agregado al carrito exitosamente',
      schema: {
        example: {
          message: 'Producto agregado al carrito',
          cart: {
            id: '507f1f77bcf86cd799439011',
            status: 'active',
          },
          item: {
            id: '507f1f77bcf86cd799439012',
            quantity: 2,
            product: {
              id: '507f1f77bcf86cd799439013',
              name: 'Producto Sostenible',
              brand: 'EcoBrand',
              price: 29.99,
              stock: 100,
              isActive: true,
            },
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos o stock insuficiente',
    }),
    ApiUnauthorizedResponse({
      description: 'Token JWT inválido o expirado',
    }),
    ApiForbiddenResponse({
      description: 'Usuario no tiene permisos de cliente',
    }),
    ApiNotFoundResponse({
      description: 'Producto no encontrado',
    }),
  );
};

export const ApiGetCartEndpoint = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Obtener carrito',
      description: 'Devuelve el carrito de compras activo del cliente con todos sus items. Requiere autenticación y rol de cliente.',
    }),
    ApiResponse({
      status: 200,
      description: 'Carrito obtenido exitosamente',
      schema: {
        example: {
          cart: {
            id: '507f1f77bcf86cd799439011',
            status: 'active',
            items: [
              {
                id: '507f1f77bcf86cd799439012',
                quantity: 2,
                product: {
                  id: '507f1f77bcf86cd799439013',
                  name: 'Producto Sostenible',
                  brand: 'EcoBrand',
                  price: 29.99,
                  stock: 100,
                  isActive: true,
                },
              },
            ],
          },
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
