import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'client', enum: ['client', 'admin'] })
  role: 'client' | 'admin';

  @Prop()
  name?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
