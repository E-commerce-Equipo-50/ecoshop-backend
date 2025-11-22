import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Certification } from './certification.schema';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CertificationService {
  constructor(
    @InjectModel(Certification.name)
    private readonly certificationModel: Model<Certification>,
    private readonly productService: ProductService,
  ) {}

  async create(
    sellerId: string,
    dto: CreateCertificationDto,
  ): Promise<Certification> {
    if (!Types.ObjectId.isValid(dto.productId)) {
      throw new BadRequestException('Invalid productId');
    }

    const product = await this.productService.findById(dto.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.seller.toString() !== sellerId) {
      throw new ForbiddenException(
        'You can only add certifications to your own products',
      );
    }

    const cert = new this.certificationModel({
      product: new Types.ObjectId(dto.productId),
      type: dto.type,
      iconUrl: dto.iconUrl,
    });
    return cert.save();
  }

  async listByProduct(productId: string): Promise<Certification[]> {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid productId');
    }

    return this.certificationModel
      .find({ product: new Types.ObjectId(productId) })
      .sort({ createdAt: -1 })
      .exec();
  }
}
