import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { Product } from 'src/product/product.schema';
import {
  ApiAddToCartEndpoint,
  ApiGetCartEndpoint,
} from './decorators/swagger-cart.decorator';

type RequestUser = { user: { id: string } };

@ApiTags('Carrito')
@Controller('carrito')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @Roles('client')
  @ApiAddToCartEndpoint()
  async addProduct(
    @Body() body: AddCartItemDto,
    @Request() req: RequestUser,
  ) {
    const { cart, item, product } = await this.cartService.addItemToCart(
      req.user.id,
      body,
    );

    return {
      message: 'Producto agregado al carrito',
      cart: {
        id: cart._id,
        status: cart.status,
      },
      item: {
        id: item._id,
        quantity: item.quantity,
        product: {
          id: product._id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          stock: product.stock,
          isActive: product.isActive,
        },
      },
    };
  }

  @Get()
  @Roles('client')
  @ApiGetCartEndpoint()
  async getCart(@Request() req: RequestUser) {
    const { cart, items } = await this.cartService.getCartWithItems(req.user.id);
    const itemsWithProducts = items.map((item) => {
      const product = (item as unknown as { product?: Product }).product;
      return {
        id: item._id,
        quantity: item.quantity,
        product: product
          ? {
              id: product._id,
              name: product.name,
              brand: product.brand,
              price: product.price,
              stock: product.stock,
              isActive: product.isActive,
            }
          : undefined,
      };
    });

    return {
      cart: {
        id: cart._id,
        status: cart.status,
        items: itemsWithProducts,
      },
    };
  }
}
