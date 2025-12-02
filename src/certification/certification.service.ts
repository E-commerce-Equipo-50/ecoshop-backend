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
import { UpdateCertificationDto } from './dto/update-certification.dto';
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

  async update(
    sellerId: string,
    certificationId: string,
    dto: UpdateCertificationDto,
  ): Promise<Certification> {
    if (!Types.ObjectId.isValid(certificationId)) {
      throw new BadRequestException('Invalid certificationId');
    }

    const cert = await this.certificationModel.findById(certificationId).exec();
    if (!cert) {
      throw new NotFoundException('Certification not found');
    }

    const productId =
      cert.product instanceof Types.ObjectId
        ? cert.product.toString()
        : String(cert.product);
    const product = await this.productService.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found for this certification');
    }
    if (product.seller.toString() !== sellerId) {
      throw new ForbiddenException(
        'You can only update certifications for your products',
      );
    }

    if (dto.type !== undefined) cert.type = dto.type;
    if (dto.iconUrl !== undefined) cert.iconUrl = dto.iconUrl;

    return cert.save();
  }

  async remove(sellerId: string, certificationId: string): Promise<void> {
    if (!Types.ObjectId.isValid(certificationId)) {
      throw new BadRequestException('Invalid certificationId');
    }

    const cert = await this.certificationModel.findById(certificationId).exec();
    if (!cert) {
      throw new NotFoundException('Certification not found');
    }

    const productId =
      cert.product instanceof Types.ObjectId
        ? cert.product.toString()
        : String(cert.product);
    const product = await this.productService.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found for this certification');
    }
    if (product.seller.toString() !== sellerId) {
      throw new ForbiddenException(
        'You can only remove certifications from your products',
      );
    }

    await this.certificationModel.findByIdAndDelete(certificationId).exec();
  }
}
