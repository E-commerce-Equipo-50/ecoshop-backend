import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartStatus = 'active' | 'checked_out';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ required: true, enum: ['active', 'checked_out'], default: 'active' })
  status: CartStatus;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
