import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ImpactMetricType =
  | 'CO2'
  | 'WATER'
  | 'ENERGY'
  | 'RECYCLED'
  | 'TRANSPORT';

@Schema({ timestamps: true })
export class ImpactMetric extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['CO2', 'WATER', 'ENERGY', 'RECYCLED', 'TRANSPORT'],
  })
  type: ImpactMetricType;

  @Prop({ required: true, min: 0 })
  value: number;

  @Prop({ required: true, trim: true })
  unit: string;

  @Prop()
  createdAt: Date;
}

export const ImpactMetricSchema = SchemaFactory.createForClass(ImpactMetric);
