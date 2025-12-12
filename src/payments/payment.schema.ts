// src/payments/payment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ required: true, unique: true })
    stripeId!: string;

    @Prop()
    orderId?: string;

    @Prop({ required: true })
    type!: 'checkout_session' | 'payment_intent';

    @Prop({ required: true })
    amount!: number;

    @Prop()
    currency?: string;

    @Prop({ default: 'created' })
    status!: 'created' | 'succeeded' | 'failed';

    @Prop({ type: Object, select: false })
    raw?: any;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
