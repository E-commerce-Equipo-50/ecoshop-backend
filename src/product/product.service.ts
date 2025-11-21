import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async createProduct(
    sellerId: string,
    dto: CreateProductDto,
  ): Promise<Product> {
    const product = new this.productModel({
      productId: new Types.ObjectId().toString(),
      ...dto,
      seller: new Types.ObjectId(sellerId),
      isActive: dto.isActive ?? true,
      stock: dto.stock ?? 0,
    });
    return product.save();
  }

  async listActive(): Promise<Product[]> {
    return this.productModel.find({ isActive: true }).exec();
  }

  async listBySeller(sellerId: string): Promise<Product[]> {
    return this.productModel
      .find({ seller: new Types.ObjectId(sellerId) })
      .exec();
  }
}
