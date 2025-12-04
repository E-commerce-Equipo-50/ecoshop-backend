import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Delete, Patch,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import {
  ApiCreateProductEndpoint,
  ApiListPublicProductsEndpoint,
  ApiListMyProductsEndpoint,
  ApiGetProductEndpoint,
  ApiUpdateProductEndpoint,
  ApiDeleteProductEndpoint,
} from './decorators/swagger-product.decorator';
import path from 'path';

@ApiTags('Productos')
@Controller('productos')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiCreateProductEndpoint()
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
        brand: created.brand,
        name: created.name,
        price: created.price,
        description: created.description,
        category: created.category,
        imageUrl: created.imageUrl,
        stock: created.stock,
        originCountry: created.originCountry,
        materials: created.materials,
        isActive: created.isActive,
        seller: created.seller,
      },
    };
  }

  @Get()
  @ApiListPublicProductsEndpoint()
  async listPublic() {
    const productsWithScores = await this.productService.listActiveWithEcoScore();
    
    // Formatear respuesta con eco-scores
    const formattedProducts = productsWithScores.map(({ product, ecoScore }) => ({
      id: product._id,
      brand: product.brand,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock,
      originCountry: product.originCountry,
      materials: product.materials,
      isActive: product.isActive,
      seller: product.seller,
      ecoScore: ecoScore ? {
        score: ecoScore.ecoScore,
        badge: ecoScore.badge,
        description: ecoScore.description,
      } : null,
    }));

    return { products: formattedProducts };
  }

  @Get('mios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiListMyProductsEndpoint()
  async listMine(@Request() req: { user: { id: string } }) {
    const products = await this.productService.listBySeller(req.user.id);
    return { products };
  }

  //Obtiene un producto
  @Get(':id')
  @ApiGetProductEndpoint()
  async getOne(@Param('id') id: string) {
    const result = await this.productService.findByIdWithEcoScore(id);

    if (!result || !result.product.isActive) {
      throw new NotFoundException('Product not found or not active');
    }

    const { product, ecoScore } = result;

    return { 
      product: {
        id: product._id,
        brand: product.brand,
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        imageUrl: product.imageUrl,
        stock: product.stock,
        originCountry: product.originCountry,
        materials: product.materials,
        isActive: product.isActive,
        seller: product.seller,
      },
      ecoScore: ecoScore ? {
        score: ecoScore.ecoScore,
        badge: ecoScore.badge,
        description: ecoScore.description,
        metrics: ecoScore.metrics,
      } : null,
    };
  }
  //Actualiza un producto.
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiUpdateProductEndpoint()
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
    @Request() req: { user: { id: string } },
  ) {
    const updated = await this.productService.updateProduct(
      id,
      req.user.id,
      body,
    );

    if (!updated) {
      throw new NotFoundException('Product not found or access denied (not your product)');
    }

    return { message: 'Product updated successfully', product: updated };
  }

  //Elimina un producto
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiDeleteProductEndpoint()
  async delete(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    const result = await this.productService.deleteProduct(id, req.user.id);

    if (result.deletedCount === 0) {
      throw new NotFoundException('Product not found or access denied (not your product)');
    }

    return { message: 'Product deleted successfully', id };
  }

}
