// src/payments/payments.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './payment.schema';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) { }

  async createIfNotExists(data: Partial<Payment>) {
    if (!data.stripeId) throw new Error('stripeId required');
    try {
      const created = await this.paymentModel.create(data);
      return created;
    } catch (err: any) {
      // duplicate key -> return existing
      if (err.code === 11000) {
        return this.paymentModel.findOne({ stripeId: data.stripeId }).exec();
      }
      throw err;
    }
  }

  async findByStripeId(stripeId: string) {
    return this.paymentModel.findOne({ stripeId }).exec();
  }

  async markSucceeded(stripeId: string, update: Partial<Payment>) {
    return this.paymentModel.findOneAndUpdate(
      { stripeId, status: { $ne: 'succeeded' } },
      { $set: { ...update, status: 'succeeded' } },
      { new: true, upsert: true },
    ).exec();
  }
}
