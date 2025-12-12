import { Controller, Post, Req, Res, Logger } from "@nestjs/common";
import type { Request, Response } from "express";
import Stripe from "stripe";
import { StripeService } from "../stripe.service";

@Controller("stripe")
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(private readonly stripeService: StripeService) {}

  @Post("webhook")
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers["stripe-signature"] as string | undefined;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

    if (!sig) {
      this.logger.warn("Missing stripe-signature header");
      return res.status(400).send("Missing stripe-signature");
    }

    let event: Stripe.Event;
    try {
      // req.body será un Buffer gracias al bodyParser.raw montado en main.ts
      event = this.stripeService
        .getClient()
        .webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      this.logger.warn(
        "Webhook signature verification failed: " + (err?.message || err),
      );
      return res.status(400).send(`Webhook Error: ${err?.message || err}`);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        this.logger.log(
          `checkout.session.completed — session=${session.id} orderId=${orderId}`,
        );
        if (orderId) {
          try {
            await this.stripeService.markOrderPaid(orderId, session.id);
          } catch (err: any) {
            this.logger.error(
              "Error marking order paid: " + (err?.message || err),
            );
          }
        }
        break;
      }
      case "payment_intent.succeeded": {
        const pi = event.data.object;
        this.logger.log(
          `payment_intent.succeeded — id=${pi.id} amount=${pi.amount}`,
        );
        break;
      }
      default:
        this.logger.debug(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
}
