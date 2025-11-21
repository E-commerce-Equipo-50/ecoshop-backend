import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seller } from './sellers.schema';

@Injectable()
export class SellersService {
  constructor(@InjectModel(Seller.name) private sellerModel: Model<Seller>) {}

  async createSeller(data: {
    brandName: string;
    email: string;
    password: string;
  }): Promise<Seller> {
    const seller = new this.sellerModel(data);
    return seller.save();
  }

  async findByEmail(email: string): Promise<Seller | null> {
    return this.sellerModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<Seller | null> {
    return this.sellerModel.findById(id).exec();
  }
}
