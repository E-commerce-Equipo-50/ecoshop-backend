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
     //"type": "CO2", "value": 1.99, "unit": "kg CO2e"},
  //"type": "WATER", "value": 150, "unit": "L"},
  //"type": "ENERGY", "value": 3.2, "unit": "kWh"},
  //type": "RECYCLED", "value": 85, "unit": "%"},
  //type": "TRANSPORT", "value": 500, "unit": "km"}

  })
  type: ImpactMetricType;

  // Campo NUEVO y crucial: El valor de la métrica del producto NO-sostenible que se está evitando.
  // Es la base para calcular el AHORRO.
  @Prop({ type: Number, required: false }) // 'required: false' porque no todos los tipos (ej: RECYCLED_MATERIAL) necesitan comparación.
  comparison_value?: number;

  @Prop({ required: true, min: 0 })
  value: number;

  @Prop({ required: true, trim: true })
  unit: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ImpactMetricSchema = SchemaFactory.createForClass(ImpactMetric);
