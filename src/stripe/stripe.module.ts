// src/stripe/stripe.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { StripeWebhookController } from './stripe-webhook/stripe-webhook.controller';
import { PaymentsModule } from '../payments/payments.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [HttpModule, PaymentsModule, forwardRef(() => OrderModule)], // forwardRef aquí también
  providers: [StripeService],
  controllers: [StripeController, StripeWebhookController],
  exports: [StripeService],
})
export class StripeModule { }
