import { Body, Controller, Post, ConflictException, UnauthorizedException } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dtos/create-seller.dto';
import { LoginSellerDto } from './dtos/login-seller.dto';
import { hashPassword, verifyPassword } from 'src/common/utils/hash.utils';
import { JwtService } from '@nestjs/jwt';

@Controller('marcas')
export class SellersController {
  constructor(
    private readonly sellersService: SellersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('registro')
  async register(@Body() body: CreateSellerDto) {
    const existing = await this.sellersService.findByEmail(body.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashed = await hashPassword(body.password);

    const seller = await this.sellersService.createSeller({
      brandName: body.brandName,
      email: body.email,
      password: hashed,
    });

    const payload = { sub: seller._id, email: seller.email, role: 'seller' };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Seller registered successfully',
      accessToken,
      seller: {
        id: seller._id,
        email: seller.email,
        brandName: seller.brandName,
      },
    };
  }

  @Post('login')
  async login(@Body() body: LoginSellerDto) {
    const seller = await this.sellersService.findByEmail(body.email);
    if (!seller) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await verifyPassword(body.password, seller.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: seller._id, email: seller.email, role: 'seller' };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Seller logged in successfully',
      accessToken,
      seller: {
        id: seller._id,
        email: seller.email,
        brandName: seller.brandName,
      },
    };
  }
}
