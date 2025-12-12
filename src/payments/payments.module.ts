import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment.schema';
import { PaymentsService } from './payments.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }])],
    providers: [PaymentsService],
    exports: [PaymentsService],
})
export class PaymentsModule { }
