import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from "@nestjs/swagger";

export const ApiCreateCheckoutSessionEndpoint = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Create Checkout Session",
      description:
        "Crea una sesión de Stripe Checkout para un pago único. El backend devuelve la URL a la que debe redirigirse el cliente.",
    }),

    ApiBody({
      description: "Datos para crear la sesión de pago",
      schema: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", example: "Test product" },
                unit_amount: {
                  type: "integer",
                  example: 1000,
                  description: "Importe en céntimos",
                },
                quantity: { type: "integer", example: 1 },
                currency: { type: "string", example: "eur" },
              },
              required: ["name", "unit_amount"],
            },
          },
          successUrl: {
            type: "string",
            format: "uri",
            example: "http://localhost:8080/success",
          },
          cancelUrl: {
            type: "string",
            format: "uri",
            example: "http://localhost:8080/cancel",
          },
          orderId: { type: "string", example: "local-123" },
          customerEmail: {
            type: "string",
            format: "email",
            example: "test@example.com",
          },
        },
        required: ["items", "successUrl", "cancelUrl"],
        example: {
          items: [
            {
              name: "Test product",
              unit_amount: 1000,
              quantity: 1,
              currency: "eur",
            },
          ],
          successUrl: "http://localhost:8080/success",
          cancelUrl: "http://localhost:8080/cancel",
          orderId: "local-123",
          customerEmail: "test@example.com",
        },
      },
    }),

    ApiResponse({
      status: 201,
      description: "Checkout session creada correctamente",
      schema: {
        example: {
          message: "Checkout session created",
          data: {
            url: "https://checkout.stripe.com/pay/cs_test_XXXXXXXXXXXX",
            sessionId: "cs_test_XXXXXXXXXXXX",
            orderId: "local-123",
          },
        },
      },
    }),

    ApiBadRequestResponse({
      description: "Datos inválidos (validación de entrada)",
      schema: {
        example: {
          statusCode: 400,
          error: "Bad Request",
          message: [
            "items must be an array",
            "successUrl must be an URL address",
          ],
        },
      },
    }),

    ApiUnauthorizedResponse({
      description:
        "Token JWT inválido o expirado (si el endpoint requiere auth)",
    }),

    ApiForbiddenResponse({
      description:
        "El usuario no tiene permisos para crear esta sesión (si aplica)",
    }),
  );
};
