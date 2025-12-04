import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/cart.schema';
import { CartItem } from '../cart-item/cart-item.schema';
import { Product } from '../product/product.schema';
import { Order } from './order.schema';
import { OrderItem } from '../order-item/order-item.schema';
import { ImpactMetric, ImpactMetricType } from '../impact_metric/impact-metric.schema';
import { calculateEcoScore } from '../common/utils/eco-score.utils';

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

  /**
   * Función auxiliar para extraer el ID del producto
   */
  private getProductId(product: unknown): string | null {
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
  }

  private async computeImpactSummary(
    items: OrderItem[],
  ): Promise<
    Array<{
      type: ImpactMetricType;
      unit: string;
      totalValue: number;
    }>
  > {
    const productQuantityMap = items.reduce<Record<string, number>>((acc, item) => {
      const productId = this.getProductId(item.product);
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

    // Inicializar acumulador de ahorro total de CO₂
    let totalAhorroCO2 = 0;

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

        // Calcular el ahorro de CO₂ si existe comparison_value
        if (metric.type === 'CO2' && metric.comparison_value) {
          const ahorroUnitario = metric.comparison_value - metric.value;
          totalAhorroCO2 += ahorroUnitario * qty;
        }

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

    const result = Object.values(summary);

    // Agregar el ahorro de CO₂ como una métrica adicional si hay ahorro
    if (totalAhorroCO2 > 0) {
      result.push({
        type: 'CO2' as ImpactMetricType,
        unit: 'kg CO2e ahorrados',
        totalValue: totalAhorroCO2,
      });
    }

    return result;
  }

  /**
   * Calcula el Eco-Score promedio ponderado de una orden
   * basado en los productos y sus cantidades
   */
  async computeOrderEcoScore(items: OrderItem[]): Promise<{
    orderEcoScore: number | null;
    orderBadge: string | null;
    productScores: Array<{
      productId: string;
      productName: string;
      quantity: number;
      ecoScore: number;
      badge: string;
    }>;
  }> {
    const productScores: Array<{
      productId: string;
      productName: string;
      quantity: number;
      ecoScore: number;
      badge: string;
    }> = [];
    
    let totalWeightedScore = 0;
    let totalQuantity = 0;

    for (const item of items) {
      const productId = this.getProductId(item.product);
      if (!productId) continue;

      // Obtener métricas del producto
      const metrics = await this.impactMetricModel.find({
        product: new Types.ObjectId(productId),
      }).exec();

      if (metrics.length === 0) continue;

      // Calcular Eco-Score del producto
      const ecoScoreResult = calculateEcoScore(metrics);
      
      // Obtener nombre del producto
      const product = (item as unknown as { product?: Product }).product;
      const productName = product?.name || 'Unknown';

      productScores.push({
        productId,
        productName,
        quantity: item.quantity,
        ecoScore: ecoScoreResult.ecoScore,
        badge: ecoScoreResult.badge,
      });

      // Ponderar por cantidad (productos con más cantidad tienen más peso)
      totalWeightedScore += ecoScoreResult.ecoScore * item.quantity;
      totalQuantity += item.quantity;
    }

    // Si no hay productos con eco-score, retornar null
    if (totalQuantity === 0 || productScores.length === 0) {
      return {
        orderEcoScore: null,
        orderBadge: null,
        productScores: [],
      };
    }

    // Calcular promedio ponderado
    const orderEcoScore = totalWeightedScore / totalQuantity;
    
    // Asignar badge a la orden
    const { getEcoBadge } = require('../common/utils/eco-score.utils');
    const badgeInfo = getEcoBadge(orderEcoScore);

    return {
      orderEcoScore: Math.round(orderEcoScore * 10) / 10,
      orderBadge: badgeInfo.badge,
      productScores,
    };
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
    const orderEcoScoreData = await this.computeOrderEcoScore(orderItems);

    return { 
      order: savedOrder, 
      items: orderItems, 
      impactSummary,
      ecoScore: orderEcoScoreData,
    };
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
        const orderEcoScoreData = await this.computeOrderEcoScore(orderItems);
        return { 
          order, 
          items: orderItems, 
          impactSummary,
          ecoScore: orderEcoScoreData,
        };
      }),
    );
  }
}
