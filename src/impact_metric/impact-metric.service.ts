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
import { ProductService } from '../product/product.service';

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
}
