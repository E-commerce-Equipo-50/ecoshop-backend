import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ImpactMetric } from './impact-metric.schema';
import { CreateImpactMetricDto } from './dto/create-impact-metric.dto';
import { UpdateImpactMetricDto } from './dto/update-impact-metric.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ImpactMetricService {
  constructor(
    @InjectModel(ImpactMetric.name)
    private readonly impactModel: Model<ImpactMetric>,
    private readonly productService: ProductService,
  ) {}

  async create(
    sellerId: string,
    dto: CreateImpactMetricDto,
  ): Promise<ImpactMetric> {
    const product = await this.productService.findById(dto.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.seller.toString() !== sellerId) {
      throw new ForbiddenException('You can only add metrics to your own products');
    }

    const metric = new this.impactModel({
      product: new Types.ObjectId(dto.productId),
      type: dto.type,
      value: dto.value,
      comparison_value: dto.comparison_value,
      unit: dto.unit,
    });
    return metric.save();
  }

  async listByProduct(productId: string): Promise<ImpactMetric[]> {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid productId');
    }
    return this.impactModel
      .find({ product: new Types.ObjectId(productId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateMetric(
    sellerId: string,
    metricId: string,
    dto: UpdateImpactMetricDto,
  ): Promise<ImpactMetric> {
    if (!Types.ObjectId.isValid(metricId)) {
      throw new BadRequestException('Invalid metricId');
    }

    const metric = await this.impactModel.findById(metricId).exec();
    if (!metric) {
      throw new NotFoundException('Impact metric not found');
    }

    const productId =
      metric.product instanceof Types.ObjectId
        ? metric.product.toString()
        : String(metric.product);
    const product = await this.productService.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found for this metric');
    }
    if (product.seller.toString() !== sellerId) {
      throw new ForbiddenException('You can only update metrics for your products');
    }

    if (dto.type !== undefined) metric.type = dto.type;
    if (dto.value !== undefined) metric.value = dto.value;
    if (dto.comparison_value !== undefined) metric.comparison_value = dto.comparison_value;
    if (dto.unit !== undefined) metric.unit = dto.unit;

    return metric.save();
  }

  async removeMetric(sellerId: string, metricId: string): Promise<void> {
    if (!Types.ObjectId.isValid(metricId)) {
      throw new BadRequestException('Invalid metricId');
    }

    const metric = await this.impactModel.findById(metricId).exec();
    if (!metric) {
      throw new NotFoundException('Impact metric not found');
    }

    const productId =
      metric.product instanceof Types.ObjectId
        ? metric.product.toString()
        : String(metric.product);
    const product = await this.productService.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found for this metric');
    }

    if (product.seller.toString() !== sellerId) {
      throw new ForbiddenException('You can only remove metrics from your products');
    }

    await this.impactModel.findByIdAndDelete(metricId).exec();
  }
}
