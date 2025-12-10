import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ImpactMetric } from '../impact_metric/impact-metric.schema';
import { calculateEcoScore, EcoScoreResult } from '../common/utils/eco-score.utils';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(ImpactMetric.name) private readonly impactMetricModel: Model<ImpactMetric>,
  ) {}

  async createProduct(
    sellerId: string,
    dto: CreateProductDto,
  ): Promise<Product> {
    const product = new this.productModel({
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

  async findById(id: string): Promise<Product | null> {
    return this.productModel.findById(id).exec();
  }

  /**
   * Obtiene un producto con su Eco-Score calculado automáticamente
   */
  async findByIdWithEcoScore(id: string): Promise<{
    product: Product;
    ecoScore: EcoScoreResult | null;
  } | null> {
    const product = await this.productModel.findById(id).exec();
    
    if (!product) {
      return null;
    }

    // Obtener todas las métricas del producto
    const metrics = await this.impactMetricModel.find({ 
      product: new Types.ObjectId(id) 
    }).exec();

    // Calcular Eco-Score si hay métricas
    const ecoScore = metrics.length > 0 ? calculateEcoScore(metrics) : null;

    return { product, ecoScore };
  }

  /**
   * Lista todos los productos activos con sus Eco-Scores
   */
  async listActiveWithEcoScore(): Promise<Array<{
    product: Product;
    ecoScore: EcoScoreResult | null;
  }>> {
    const products = await this.productModel.find({ isActive: true }).exec();
    
    const productsWithScores = await Promise.all(
      products.map(async (product) => {
        const metrics = await this.impactMetricModel.find({ 
          product: product._id 
        }).exec();
        
        const ecoScore = metrics.length > 0 ? calculateEcoScore(metrics) : null;
        
        return { product, ecoScore };
      })
    );

    return productsWithScores;
  }

  async updateProduct(
    productId: string,
    sellerId: string,
    dto: UpdateProductDto,
  ): Promise<Product | null> {
    return this.productModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(productId), seller: new Types.ObjectId(sellerId) },
        { $set: dto },
        { new: true }, // Devuelve el documento actualizado
      )
      .exec();
  }
  async deleteProduct(
    productId: string,
    sellerId: string,
  ): Promise<{ deletedCount: number }> {
    const result = await this.productModel.deleteOne({
      _id: new Types.ObjectId(productId),
      seller: new Types.ObjectId(sellerId),
    }).exec();
    return { deletedCount: result.deletedCount };
  }

}
