import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartService } from 'src/cart/cart.service';
import { Cart } from 'src/cart/cart.schema';
import { CartItem } from 'src/cart-item/cart-item.schema';
import { Product } from 'src/product/product.schema';
import { Order } from './order.schema';
import { OrderItem } from 'src/order-item/order-item.schema';
import { ImpactMetric, ImpactMetricType } from 'src/impact_metric/impact-metric.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(OrderItem.name)
    private readonly orderItemModel: Model<OrderItem>,
    @InjectModel(CartItem.name)
    private readonly cartItemModel: Model<CartItem>,
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(ImpactMetric.name)
    private readonly impactMetricModel: Model<ImpactMetric>,
    private readonly cartService: CartService,
  ) {}

  private async computeImpactSummary(
    items: OrderItem[],
  ): Promise<
    Array<{
      type: ImpactMetricType;
      unit: string;
      totalValue: number;
    }>
  > {
    const getProductId = (product: unknown): string | null => {
      if (product instanceof Types.ObjectId) {
        return product.toString();
      }
      if (typeof product === 'string') {
        return product;
      }
      if (product && typeof product === 'object') {
        const prodObj = product as { _id?: unknown };
        if (prodObj._id instanceof Types.ObjectId) {
          return prodObj._id.toString();
        }
        if (typeof prodObj._id === 'string') {
          return prodObj._id;
        }
      }
      return null;
    };

    const productQuantityMap = items.reduce<Record<string, number>>((acc, item) => {
      const productId = getProductId(item.product);
      if (!productId) return acc;
      acc[productId] = (acc[productId] ?? 0) + item.quantity;
      return acc;
    }, {});

    const productIdsRaw = Object.keys(productQuantityMap);
    const productIdsObj = productIdsRaw
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));
    if (productIdsRaw.length === 0) return [];

    const metrics = await this.impactMetricModel
      .find({ product: { $in: [...productIdsObj, ...productIdsRaw] } })
      .exec();

    const summary =
      metrics.reduce<
        Record<string, { type: ImpactMetricType; unit: string; totalValue: number }>
      >((acc, metric) => {
        const productId = metric.product instanceof Types.ObjectId
          ? metric.product.toString()
          : String(metric.product);
        const qty = productQuantityMap[productId] ?? 0;
        if (qty === 0) return acc;
        const key = `${metric.type}-${metric.unit}`;
        const subtotal = metric.value * qty;
        if (!acc[key]) {
          acc[key] = {
            type: metric.type,
            unit: metric.unit,
            totalValue: subtotal,
          };
        } else {
          acc[key].totalValue += subtotal;
        }
        return acc;
      }, {}) ?? {};

    return Object.values(summary);
  }

  async createFromCart(customerId: string) {
    const cart = await this.cartService.ensureActiveCart(customerId);
    const cartItems = await this.cartItemModel
      .find({ cart: cart._id })
      .populate('product')
      .exec();

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const orderItemsPayload = cartItems.map((item) => {
      const product = (item as unknown as { product?: Product }).product;
      if (!product || product.isActive === false) {
        throw new NotFoundException('Product not available');
      }

      const quantity = item.quantity;
      const unitPrice = product.price;
      const subtotal = quantity * unitPrice;

      return {
        productId: product._id,
        quantity,
        unitPrice,
        subtotal,
      };
    });

    const total = orderItemsPayload.reduce(
      (acc, curr) => acc + curr.subtotal,
      0,
    );

    const order = new this.orderModel({
      customer: new Types.ObjectId(customerId),
      status: 'pending',
      total,
    });
    const savedOrder = await order.save();

    const orderItemsToSave = orderItemsPayload.map((item) => ({
      order: savedOrder._id,
      product: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    }));

    await this.orderItemModel.insertMany(orderItemsToSave);

    await this.cartModel
      .findByIdAndUpdate(cart._id, { status: 'checked_out' })
      .exec();
    await this.cartItemModel.deleteMany({ cart: cart._id }).exec();
    await this.cartService.ensureActiveCart(customerId);

    const orderItems = await this.orderItemModel
      .find({ order: savedOrder._id })
      .populate('product')
      .exec();

    const impactSummary = await this.computeImpactSummary(orderItems);

    return { order: savedOrder, items: orderItems, impactSummary };
  }

  async listByCustomer(customerId: string) {
    const orders = await this.orderModel
      .find({ customer: new Types.ObjectId(customerId) })
      .sort({ createdAt: -1 })
      .exec();

    const orderIds = orders.map((o) => o._id);
    if (orderIds.length === 0) {
      return [];
    }

    const items = await this.orderItemModel
      .find({ order: { $in: orderIds } })
      .populate('product')
      .exec();

    const itemsByOrder = items.reduce<Record<string, OrderItem[]>>(
      (acc, item) => {
        const key = item.order.toString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      {},
    );

    return Promise.all(
      orders.map(async (order) => {
        const orderId = String(order._id);
        const orderItems = itemsByOrder[orderId] ?? [];
        const impactSummary = await this.computeImpactSummary(orderItems);
        return { order, items: orderItems, impactSummary };
      }),
    );
  }
}
