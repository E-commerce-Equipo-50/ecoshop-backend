import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
  Headers,
} from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { CreateCheckoutSessionDto } from "./dto/create-checkout-session.dto";
import { CreatePaymentIntentDto } from "./dto/create-payment-intent.dto";

@Controller("stripe")
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post("create-checkout-session")
  async createCheckout(@Body() body: CreateCheckoutSessionDto) {
    const { items, successUrl, cancelUrl, orderId, customerEmail } = body;
    if (!items?.length) throw new BadRequestException("items required");

    const lineItems = items.map((it) => ({
      price_data: {
        currency: it.currency || "eur",
        product_data: { name: it.name },
        unit_amount: it.unit_amount,
      },
      quantity: it.quantity ?? 1,
    }));

    const session = await this.stripeService.createCheckoutSession(
      orderId ?? "local-temp",
      lineItems,
      successUrl,
      cancelUrl,
      customerEmail,
    );

    // Devuelve 201 por creación
    return {
      message: "Checkout session created",
      data: {
        url: session.url,
        sessionId: session.id,
        orderId,
      },
    };
  }

  @Post("create-payment-intent")
  async createPaymentIntent(
    @Body() body: CreatePaymentIntentDto,
    @Headers("idempotency-key") idempotencyKey?: string,
  ) {
    const { amount, currency = "eur", customerId, metadata } = body;
    if (!amount || amount <= 0)
      throw new BadRequestException("amount required");

    const pi = await this.stripeService.createPaymentIntent(
      amount,
      currency,
      customerId,
      metadata,
      idempotencyKey,
    );
    return { clientSecret: pi.client_secret, id: pi.id };
  }

  @Get("session/:id")
  async getSession(@Param("id") id: string) {
    const session = await this.stripeService.retrieveSession(id);
    return session;
  }

  /**
   * Optional: endpoint dev/no-signature to help debugging from Swagger/Postman.
   * REMOVE or PROTECT in production.
   */
  @Post("webhook-dev")
  async handleWebhookDev(@Body() body: any) {
    const event = body;
    switch (event?.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        if (orderId) {
          try {
            await this.stripeService.markOrderPaid(orderId, session.id);
          } catch (err: any) {
            // ignore
          }
        }
        break;
      }
      case "payment_intent.succeeded": {
        const pi = event.data.object;
        // handle as needed
        break;
      }
      default:
        break;
    }
    return { received: true, debug: true };
  }
}
