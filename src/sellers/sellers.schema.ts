import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Seller extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  brandName: string;

  @Prop({ default: 'seller' })
  role: 'seller';

  @Prop()
  createdAt: Date;
}

export const SellerSchema = SchemaFactory.createForClass(Seller);
