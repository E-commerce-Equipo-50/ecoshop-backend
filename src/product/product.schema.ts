import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  // Marca (nombre comercial del seller)
  @Prop({ required: true, trim: true, uppercase: true })
  brand: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ trim: true, uppercase: true })
  category?: string;

  @Prop({ trim: true })
  imageUrl?: string;

  @Prop({ default: 0, min: 0 })
  stock: number;

  @Prop({ trim: true })
  originCountry?: string;

  @Prop({ trim: true })
  materials?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Seller', required: true })
  seller: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
