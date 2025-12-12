// src/stripe/stripe.service.ts
import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PaymentsService } from '../payments/payments.service'; // Ajusta la ruta si tu PaymentsService está en otro sitio
import { OrderService } from 'src/order/order.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    private readonly http: HttpService,
    private readonly paymentsService: PaymentsService, // inyectado
    private readonly orderService: OrderService,

  ) {
    const apiKey = process.env.STRIPE_SECRET_KEY || '';
    const apiVersion = process.env.STRIPE_API_VERSION || '2022-11-15';


    if (!apiKey) {
      this.logger.warn(
        'STRIPE_SECRET_KEY not set. Stripe client will be unavailable until configured.',
      );
    }

    this.stripe = new Stripe(apiKey, { apiVersion: apiVersion as any });
  }

  /** Devuelve el cliente de Stripe (SDK) */
  getClient(): Stripe {
    return this.stripe;
  }

  /**
   * Utilidad: crear una Checkout Session.
   */
  async createCheckoutSession(
    orderId: string,
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    successUrl: string,
    cancelUrl: string,
    customerEmail?: string,
  ) {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { orderId },
      customer_email: customerEmail,
    });
  }

  /**
   * Crear PaymentIntent (para UI propio - Stripe Elements)
   */
  async createPaymentIntent(
    amount: number,
    currency = 'eur',
    customerId?: string,
    metadata?: Record<string, string>,
    idempotencyKey?: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const params: Stripe.PaymentIntentCreateParams = {
      amount,
      currency,
      customer: customerId,
      metadata,
    };

    const opts: Stripe.RequestOptions = {};
    if (idempotencyKey) opts.idempotencyKey = idempotencyKey;

    return this.stripe.paymentIntents.create(params, opts);
  }

  /**
   * Crear un Customer en Stripe
   */
  async createCustomer(email: string, name?: string) {
    return this.stripe.customers.create({ email, name });
  }

  /**
   * Recuperar una Checkout Session (expandir payment_intent si hace falta)
   */
  async retrieveSession(sessionId: string) {
    return this.stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent'] });
  }

  /**
   * Marca la orden como pagada (robusto e idempotente).
   * - Registra/actualiza payment localmente (usando PaymentsService)
   * - Intenta notificar ECOSHOP_API_BASE/orders/:id/pay si está configurado
   *
   * Nota: paymentsService debe ser provisto (Mongoose/TypeORM impl).
   */
  async markOrderPaid(
    orderId: string,
    stripeId: string,
    amount?: number,
    currency?: string,
    rawEvent?: any,
  ) {
    // 1) Registrar / asegurar existencia del payment (createIfNotExists)
    try {
      await this.paymentsService.createIfNotExists({
        stripeId,
        orderId,
        type: 'payment_intent',
        amount: amount ?? 0,
        currency,
        status: 'created',
        raw: rawEvent ? { receivedAt: new Date(), ...rawEvent } : undefined,
      });
    } catch (err: any) {
      // si falla la creación por otro motivo, lo logueamos pero seguimos
      this.logger.warn(`Warning creating payment record: ${err?.message || err}`);
    }

    // 2) Comprobar si ya está marcado succeeded en local
    const existing = await this.paymentsService.findByStripeId(stripeId);
    if (existing && existing.status === 'succeeded') {
      this.logger.log(`Payment ${stripeId} already processed (idempotent).`);
      return existing;
    }

    // 3) Si hay ECOSHOP_API_BASE, notificar al endpoint externo (tu orden)
    if (process.env.ECOSHOP_API_BASE) {
      const url = `${process.env.ECOSHOP_API_BASE.replace(/\/$/, '')}/orders/${orderId}/pay`;
      try {
        const resp$ = this.http.post(url, { stripeSessionId: stripeId });
        const resp = await firstValueFrom(resp$);
        // 4) si OK, marcar local payment como succeeded
        await this.paymentsService.markSucceeded(stripeId, { amount, currency, raw: rawEvent });
        this.logger.log(`Order ${orderId} marked paid in ECOSHOP and local payment updated.`);

        await this.paymentsService.markSucceeded(stripeId, { amount, currency, raw: rawEvent });
        this.logger.log(`Payment ${stripeId} marked locally as succeeded.`);

        // NOTIFICAR/ACTUALIZAR LA ORDEN LOCAL
        try {
          await this.orderService.markOrderAsPaid(orderId, { stripeId, amount });
          this.logger.log(`Order ${orderId} updated to paid.`);
        } catch (err: any) {
          this.logger.warn(`Unable to update order ${orderId}: ${err?.message || err}`);
        }
        return resp.data;
      } catch (err: any) {
        this.logger.error(`Error calling ${url}: ${err?.message || err}`);
        // No marcar succeeded para permitir reintento posterior
        throw err;
      }
    }

    // 5) Si no hay endpoint ECOSHOP, simplemente marca succeeded localmente
    const updated = await this.paymentsService.markSucceeded(stripeId, { amount, currency, raw: rawEvent });
    this.logger.log(`Payment ${stripeId} marked locally as succeeded.`);
    return updated;
  }
}
