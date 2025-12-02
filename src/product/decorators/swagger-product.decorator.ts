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

export const ApiCreateProductEndpoint = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Crear nuevo producto',
      description: 'Permite a un vendedor crear un nuevo producto. Requiere autenticación y rol de seller.',
    }),
    ApiResponse({
      status: 201,
      description: 'Producto creado exitosamente',
      schema: {
        example: {
          message: 'Product created successfully',
          product: {
            id: '507f1f77bcf86cd799439011',
            brand: 'EcoBrand',
            name: 'Producto Sostenible',
            price: 29.99,
            description: 'Descripción del producto',
            category: 'electronics',
            imageUrl: 'https://example.com/image.jpg',
            stock: 100,
            originCountry: 'España',
            materials: ['reciclado', 'orgánico'],
            isActive: true,
            seller: '507f1f77bcf86cd799439012',
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
      description: 'Usuario no tiene permisos de vendedor',
    }),
  );
};

export const ApiListPublicProductsEndpoint = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar productos activos',
      description: 'Devuelve todos los productos activos disponibles para la venta. No requiere autenticación.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de productos obtenida exitosamente',
      schema: {
        example: {
          products: [
            {
              id: '507f1f77bcf86cd799439011',
              brand: 'EcoBrand',
              name: 'Producto Sostenible',
              price: 29.99,
              category: 'electronics',
              stock: 100,
              isActive: true,
            },
          ],
        },
      },
    }),
  );
};

export const ApiListMyProductsEndpoint = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Listar mis productos',
      description: 'Devuelve todos los productos del vendedor autenticado. Requiere autenticación y rol de seller.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de productos del vendedor obtenida exitosamente',
      schema: {
        example: {
          products: [
            {
              id: '507f1f77bcf86cd799439011',
              brand: 'EcoBrand',
              name: 'Producto Sostenible',
              price: 29.99,
              isActive: true,
            },
          ],
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Token JWT inválido o expirado',
    }),
    ApiForbiddenResponse({
      description: 'Usuario no tiene permisos de vendedor',
    }),
  );
};

export const ApiGetProductEndpoint = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener un producto',
      description: 'Devuelve la información detallada de un producto activo. No requiere autenticación.',
    }),
    ApiResponse({
      status: 200,
      description: 'Producto obtenido exitosamente',
      schema: {
        example: {
          product: {
            id: '507f1f77bcf86cd799439011',
            brand: 'EcoBrand',
            name: 'Producto Sostenible',
            price: 29.99,
            description: 'Descripción detallada',
            category: 'electronics',
            stock: 100,
            isActive: true,
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Producto no encontrado o inactivo',
    }),
  );
};

export const ApiUpdateProductEndpoint = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Actualizar producto',
      description: 'Permite a un vendedor actualizar su propio producto. Requiere autenticación y rol de seller.',
    }),
    ApiResponse({
      status: 200,
      description: 'Producto actualizado exitosamente',
      schema: {
        example: {
          message: 'Product updated successfully',
          product: {
            id: '507f1f77bcf86cd799439011',
            brand: 'EcoBrand',
            name: 'Producto Actualizado',
            price: 39.99,
            isActive: true,
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
      description: 'Usuario no tiene permisos de vendedor',
    }),
    ApiNotFoundResponse({
      description: 'Producto no encontrado o no pertenece al vendedor',
    }),
  );
};

export const ApiDeleteProductEndpoint = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Eliminar producto',
      description: 'Permite a un vendedor eliminar su propio producto. Requiere autenticación y rol de seller.',
    }),
    ApiResponse({
      status: 200,
      description: 'Producto eliminado exitosamente',
      schema: {
        example: {
          message: 'Product deleted successfully',
          id: '507f1f77bcf86cd799439011',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Token JWT inválido o expirado',
    }),
    ApiForbiddenResponse({
      description: 'Usuario no tiene permisos de vendedor',
    }),
    ApiNotFoundResponse({
      description: 'Producto no encontrado o no pertenece al vendedor',
    }),
  );
};
