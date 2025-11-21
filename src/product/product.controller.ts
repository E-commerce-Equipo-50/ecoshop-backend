import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('productos')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  async create(
    @Body() body: CreateProductDto,
    @Request() req: { user: { id: string } },
  ) {
    const created = await this.productService.createProduct(
      req.user.id,
      body,
    );
    return {
      message: 'Product created successfully',
      product: {
        id: created._id,
        name: created.name,
        price: created.price,
        description: created.description,
        isActive: created.isActive,
        seller: created.seller,
      },
    };
  }

  @Get()
  async listPublic() {
    const products = await this.productService.listActive();
    return { products };
  }

  @Get('mios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  async listMine(@Request() req: { user: { id: string } }) {
    const products = await this.productService.listBySeller(req.user.id);
    return { products };
  }
}
