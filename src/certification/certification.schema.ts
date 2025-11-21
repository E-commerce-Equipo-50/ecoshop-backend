import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CertificationType = 'FAIR_TRADE' | 'CARBON_NEUTRAL' | 'GOTS';

@Schema({ timestamps: true })
export class Certification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['FAIR_TRADE', 'CARBON_NEUTRAL', 'GOTS'],
  })
  type: CertificationType;

  @Prop({ required: true, trim: true })
  iconUrl: string;

  @Prop()
  createdAt: Date;
}

export const CertificationSchema = SchemaFactory.createForClass(Certification);
