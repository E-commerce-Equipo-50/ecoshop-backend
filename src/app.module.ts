import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SellersModule } from './sellers/sellers.module';
import { CustomersModule } from './customers/customers.module';
import { HealthController } from './check/health/health.controller';
import { ProductModule } from './product/product.module';
import { ImpactMetricModule } from './impact_metric/impact-metric.module';
import { CertificationModule } from './certification/certification.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URI ?? ''),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET') || 'jwt_default_secret',
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    // Modulo para flujo de SELLER (marcas)
    SellersModule,
    CustomersModule,
    ProductModule,
    ImpactMetricModule,
    CertificationModule,
    CartModule,
    OrderModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}

console.log('MONGODB_URI:', process.env.MONGO_DB_URI);
