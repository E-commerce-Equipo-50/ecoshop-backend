import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SellersModule } from './sellers/sellers.module';
import { CustomersModule } from './customers/customers.module';
import { HealthController } from './check/health/health.controller';
import { ProductModule } from './product/product.module';
import { ImpactMetricModule } from './impact_metric/impact-metric.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET') || 'jwt_default_secret',
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URI ?? ''),
    AuthModule,
    // Modulo para flujo de SELLER (marcas)
    SellersModule,
    CustomersModule,
    ProductModule,
    ImpactMetricModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}

console.log('MONGODB_URI:', process.env.MONGO_DB_URI);
