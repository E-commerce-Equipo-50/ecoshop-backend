import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './customers.schema';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private customerModel: Model<Customer>) {}

  async createUser(data: {
    email: string;
    password: string;
    name?: string;
    role?: 'client' | 'admin';
  }): Promise<Customer> {
    const user = new this.customerModel(data);
    return user.save();
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.customerModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<Customer | null> {
    return this.customerModel.findById(id).exec();
  }
}
