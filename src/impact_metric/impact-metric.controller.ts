import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateImpactMetricDto } from './dto/create-impact-metric.dto';
import { ImpactMetricService } from './impact-metric.service';

@Controller('impacto')
export class ImpactMetricController {
  constructor(private readonly impactService: ImpactMetricService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  async create(
    @Body() body: CreateImpactMetricDto,
    @Request() req: { user: { id: string } },
  ) {
    const metric = await this.impactService.create(req.user.id, body);
    return {
      message: 'Impact metric created',
      metric: {
        id: metric._id,
        product: metric.product,
        type: metric.type,
        value: metric.value,
        unit: metric.unit,
        createdAt: metric.createdAt,
      },
    };
  }

  @Get(':productId')
  async listByProduct(@Param('productId') productId: string) {
    const metrics = await this.impactService.listByProduct(productId);
    return { metrics };
  }
}
