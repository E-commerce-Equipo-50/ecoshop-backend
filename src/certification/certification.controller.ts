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
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import {
  ApiCreateCertificationEndpoint,
  ApiListCertificationsByProductEndpoint,
  ApiUpdateCertificationEndpoint,
  ApiDeleteCertificationEndpoint,
} from './decorators/swagger-certification.decorator';

@ApiTags('Certificaciones')
@Controller('certificaciones')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiCreateCertificationEndpoint()
  async create(
    @Body() body: CreateCertificationDto,
    @Request() req: { user: { id: string } },
  ) {
    const cert = await this.certificationService.create(req.user.id, body);
    return {
      message: 'Certification created',
      certification: {
        id: cert._id,
        product: cert.product,
        type: cert.type,
        iconUrl: cert.iconUrl,
        createdAt: cert.createdAt,
      },
    };
  }

  @Get(':productId')
  @ApiListCertificationsByProductEndpoint()
  async listByProduct(@Param('productId') productId: string) {
    const certifications =
      await this.certificationService.listByProduct(productId);
    return { certifications };
  }

  @Patch(':certificationId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiUpdateCertificationEndpoint()
  async update(
    @Param('certificationId') certificationId: string,
    @Body() body: UpdateCertificationDto,
    @Request() req: { user: { id: string } },
  ) {
    const cert = await this.certificationService.update(
      req.user.id,
      certificationId,
      body,
    );
    return {
      message: 'Certification updated',
      certification: {
        id: cert._id,
        product: cert.product,
        type: cert.type,
        iconUrl: cert.iconUrl,
        updatedAt: cert.updatedAt,
      },
    };
  }

  @Delete(':certificationId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @ApiDeleteCertificationEndpoint()
  async remove(
    @Param('certificationId') certificationId: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.certificationService.remove(req.user.id, certificationId);
    return { message: 'Certification removed' };
  }
}
