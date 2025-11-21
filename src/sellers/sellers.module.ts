import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SellersService } from './sellers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Seller, SellerSchema } from './sellers.schema';
import { SellersController } from './sellers.controller';
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'jwt_default_secret',
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Seller.name, schema: SellerSchema }]),
  ],
  controllers: [SellersController],
  providers: [SellersService],
  exports: [SellersService],
})
export class SellersModule {}
