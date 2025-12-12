import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { StripeService } from "./stripe.service";
import { StripeController } from "./stripe.controller";
import { StripeWebhookController } from "./stripe-webhook/stripe-webhook.controller";
import { PaymentsModule } from "../payments/payments.module";

@Module({
  imports: [HttpModule, PaymentsModule],
  providers: [StripeService],
  controllers: [StripeController, StripeWebhookController],
  exports: [StripeService],
})
export class StripeModule {}
