import {
  Body,
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateImpactMetricDto } from './dto/create-impact-metric.dto';
import { UpdateImpactMetricDto } from './dto/update-impact-metric.dto';
import { ImpactMetricService } from './impact-metric.service';
import {
  ApiCreateImpactMetricEndpoint,
  ApiListImpactMetricsByProductEndpoint,
  ApiUpdateImpactMetricEndpoint,
  ApiDeleteImpactMetricEndpoint,
} from './decorators/swagger-impact-metric.decorator';

@ApiTags('Métricas de Impacto')
@Controller('impacto')
export class ImpactMetricController {
  constructor(private readonly impactService: ImpactMetricService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiCreateImpactMetricEndpoint()
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
  @ApiListImpactMetricsByProductEndpoint()
  async listByProduct(@Param('productId') productId: string) {
    const metrics = await this.impactService.listByProduct(productId);
    return { metrics };
  }

  @Patch(':metricId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiUpdateImpactMetricEndpoint()
  async update(
    @Param('metricId') metricId: string,
    @Body() body: UpdateImpactMetricDto,
    @Request() req: { user: { id: string } },
  ) {
    const metric = await this.impactService.updateMetric(
      req.user.id,
      metricId,
      body,
    );
    return {
      message: 'Impact metric updated',
      metric: {
        id: metric._id,
        product: metric.product,
        type: metric.type,
        value: metric.value,
        unit: metric.unit,
        updatedAt: metric.updatedAt,
      },
    };
  }

  @Delete(':metricId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiDeleteImpactMetricEndpoint()
  async remove(
    @Param('metricId') metricId: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.impactService.removeMetric(req.user.id, metricId);
    return { message: 'Impact metric removed' };
  }
}
