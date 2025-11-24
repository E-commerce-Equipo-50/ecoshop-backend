import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { OrderService } from './order.service';
import { Product } from '../product/product.schema';

type RequestUser = { user: { id: string } };

@Controller('ordenes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('client')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
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

    return {
      message: 'Orden creada correctamente',
      order: {
        id: order._id,
        status: order.status,
        total: order.total,
        items: itemsFormatted,
      },
      impactSummary,
    };
  }

  @Get()
  async list(@Request() req: RequestUser) {
    const orders = await this.orderService.listByCustomer(req.user.id);

    return {
      orders: orders.map(({ order, items, impactSummary }) => ({
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
      })),
    };
  }
}
