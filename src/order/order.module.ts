import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'src/cart/cart.schema';
import { CartItem, CartItemSchema } from 'src/cart-item/cart-item.schema';
import { CartModule } from 'src/cart/cart.module';
import { OrderItem, OrderItemSchema } from 'src/order-item/order-item.schema';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, OrderSchema } from './order.schema';
import {
  ImpactMetric,
  ImpactMetricSchema,
} from 'src/impact_metric/impact-metric.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderItem.name, schema: OrderItemSchema },
      { name: Cart.name, schema: CartSchema },
      { name: CartItem.name, schema: CartItemSchema },
      { name: ImpactMetric.name, schema: ImpactMetricSchema },
    ]),
    CartModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
