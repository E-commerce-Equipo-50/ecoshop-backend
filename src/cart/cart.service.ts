import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductService } from 'src/product/product.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { Cart } from './cart.schema';
import { CartItem } from 'src/cart-item/cart-item.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(CartItem.name)
    private readonly cartItemModel: Model<CartItem>,
    private readonly productService: ProductService,
  ) {}

  async ensureActiveCart(customerId: string): Promise<Cart> {
    const customerObjectId = new Types.ObjectId(customerId);
    const existing = await this.cartModel
      .findOne({ customer: customerObjectId, status: 'active' })
      .exec();

    if (existing) {
      return existing;
    }

    const cart = new this.cartModel({
      customer: customerObjectId,
      status: 'active',
    });
    return cart.save();
  }

  async addItemToCart(customerId: string, dto: AddCartItemDto) {
    const product = await this.productService.findById(dto.productId);
    if (!product || product.isActive === false) {
      throw new NotFoundException('Product not found');
    }

    const cart = await this.ensureActiveCart(customerId);
    const productId = new Types.ObjectId(dto.productId);
    const quantityToAdd = dto.quantity && dto.quantity > 0 ? dto.quantity : 1;

    const existingItem = await this.cartItemModel
      .findOne({ cart: cart._id, product: productId })
      .exec();

    let item: CartItem;
    if (existingItem) {
      existingItem.quantity += quantityToAdd;
      item = await existingItem.save();
    } else {
      const newItem = new this.cartItemModel({
        cart: cart._id,
        product: productId,
        quantity: quantityToAdd,
      });
      item = await newItem.save();
    }

    return { cart, item, product };
  }

  async getCartWithItems(customerId: string) {
    const cart = await this.ensureActiveCart(customerId);
    const items = await this.cartItemModel
      .find({ cart: cart._id })
      .populate('product')
      .exec();

    return { cart, items };
  }
}
