import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderStatus = 'pending' | 'paid' | 'cancelled';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ required: true, enum: ['pending', 'paid', 'cancelled'], default: 'pending' })
  status: OrderStatus;

  @Prop({ required: true, min: 0 })
  total: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
