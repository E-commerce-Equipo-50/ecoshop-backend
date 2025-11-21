import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Certification, CertificationSchema } from './certification.schema';
import { CertificationController } from './certification.controller';
import { CertificationService } from './certification.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Certification.name, schema: CertificationSchema },
    ]),
    ProductModule,
  ],
  controllers: [CertificationController],
  providers: [CertificationService],
})
export class CertificationModule {}
