import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SellersModule } from './sellers/sellers.module';
import { CustomersModule } from './customers/customers.module';
import { HealthController } from './check/health/health.controller';
import { ProductModule } from './product/product.module';
import { ImpactMetricModule } from './impact_metric/impact-metric.module';
import { CertificationModule } from './certification/certification.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import configurations from './config';
import { PaymentsModule } from './payments/payments.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: configurations,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),
    AuthModule,
    SellersModule,
    CustomersModule,
    ProductModule,
    ImpactMetricModule,
    CertificationModule,
    CartModule,
    OrderModule,
    PaymentsModule,
    StripeModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}