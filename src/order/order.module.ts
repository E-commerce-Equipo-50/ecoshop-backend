import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from '../cart/cart.schema';
import { CartItem, CartItemSchema } from '../cart-item/cart-item.schema';
import { CartModule } from '../cart/cart.module';
import { OrderItem, OrderItemSchema } from '../order-item/order-item.schema';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, OrderSchema } from './order.schema';
import {
  ImpactMetric,
  ImpactMetricSchema,
} from '../impact_metric/impact-metric.schema';
import { PaymentsModule } from '../payments/payments.module';
import { StripeModule } from '../stripe/stripe.module';

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
    PaymentsModule,
    forwardRef(() => StripeModule),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
