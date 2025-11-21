import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImpactMetric, ImpactMetricSchema } from './impact-metric.schema';
import { ImpactMetricController } from './impact-metric.controller';
import { ImpactMetricService } from './impact-metric.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImpactMetric.name, schema: ImpactMetricSchema },
    ]),
    ProductModule,
  ],
  controllers: [ImpactMetricController],
  providers: [ImpactMetricService],
})
export class ImpactMetricModule {}
