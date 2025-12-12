import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OrderService } from './order.service';
import { Product } from '../product/product.schema';
import {
  ApiCreateOrderEndpoint,
  ApiListOrdersEndpoint,
} from './decorators/swagger-order.decorator';
import { ForbiddenException } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { StripeService } from '../stripe/stripe.service';
import { PaymentsService } from '../payments/payments.service';

type RequestUser = { user: { id: string } };

@ApiTags('Órdenes')
@Controller('ordenes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('client')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly stripeService: StripeService,
    private readonly paymentsService: PaymentsService,
  ) { }

  @Post()
  @ApiCreateOrderEndpoint()
  async create(@Request() req: RequestUser) {
    const { order, items, impactSummary } =
      await this.orderService.createFromCart(req.user.id);

    const itemsFormatted = items.map((item) => {
      const product = (item as unknown as { product?: Product }).product;
      return {
        id: item._id,
        product: product
          ? {
            id: product._id,
            name: product.name,
            brand: product.brand,
            price: product.price,
          }
          : undefined,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      };
    });

    // Calcular Eco-Score de la orden
    const ecoScore = await this.orderService.computeOrderEcoScore(items);

    return {
      message: 'Orden creada correctamente',
      order: {
        id: order._id,
        status: order.status,
        total: order.total,
        items: itemsFormatted,
      },
      impactSummary,
      ecoScore,
    };
  }

  @Get()
  @ApiListOrdersEndpoint()
  async list(@Request() req: RequestUser) {
    const orders = await this.orderService.listByCustomer(req.user.id);

    return {
      orders: await Promise.all(
        orders.map(async ({ order, items, impactSummary }) => {
          // Calcular Eco-Score para cada orden
          const ecoScore = await this.orderService.computeOrderEcoScore(items);

          return {
            id: order._id,
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
            items: items.map((item) => {
              const product = (item as unknown as { product?: Product }).product;
              return {
                id: item._id,
                product: product
                  ? {
                    id: product._id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                  }
                  : undefined,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                subtotal: item.subtotal,
              };
            }),
            impactSummary,
            ecoScore,
          };
        }),
      ),
    };
  }

  /**
   * Crea la orden a partir del carrito del cliente y devuelve la URL de Stripe Checkout.
   * Asume que identificas al cliente por request (aquí simplificado con customerId en body).
   */

  @Post()
  async createOrderAndCheckout(@Body() body: { customerId: string }) {
    const { customerId } = body;
    if (!customerId) throw new ForbiddenException('customerId required');

    // 1) crear orden desde carrito (ya calcula total, items, ecoScore, etc.)
    const created = (await this.orderService.createFromCart(customerId)) as any;
    // created: { order, items, impactSummary, ecoScore }
    const order = created?.order as any;
    const items = created?.items as any[] ?? [];

    if (!order) {
      throw new ForbiddenException('Unable to create order from cart');
    }

    // Obtener el id de la orden como string de forma segura
    const orderIdStr = (() => {
      try {
        if (order._id && typeof order._id.toString === 'function') return order._id.toString();
        return String(order._id ?? order.id);
      } catch {
        return String(order._id ?? order.id);
      }
    })();

    // 2) construir lineItems para Stripe desde order items
    const lineItems = items.map((it: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: it?.product?.name ?? 'Product',
        },
        unit_amount: Math.round((it?.unitPrice ?? 0) * 100),
      },
      quantity: it?.quantity ?? 1,
    }));

    // 3) crear Checkout Session con metadata.orderId para enlazar webhooks
    const successUrl = `http://localhost:3000/ordenes/${orderIdStr}/success`; // ajusta a tu front
    const cancelUrl = `http://localhost:3000/ordenes/${orderIdStr}/cancel`;

    const session = await this.stripeService.createCheckoutSession(
      orderIdStr,
      lineItems,
      successUrl,
      cancelUrl,
      undefined,
    );

    // 4) crear registro de payment local ligado a la orden (stripeId = session.id)
    await this.paymentsService.createIfNotExists({
      stripeId: session.id,
      orderId: orderIdStr,
      type: 'checkout_session',
      amount: Math.round((order.total ?? 0) * 100),
      currency: 'eur',
      status: 'created',
    });

    // 5) devolver info al cliente
    return {
      message: 'Order created and checkout session generated',
      orderId: orderIdStr,
      checkoutUrl: session.url,
      sessionId: session.id,
      impactSummary: created.impactSummary,
      ecoScore: created.ecoScore,
    };
  }

}
