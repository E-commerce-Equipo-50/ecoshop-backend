import { Body, Controller, Post, HttpCode, ConflictException, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { LoginAuthDto } from 'src/auth/dto/login-auth.dto';
import { hashPassword, verifyPassword } from 'src/common/utils/hash.utils';
import { JwtService } from '@nestjs/jwt';
import { CartService } from 'src/cart/cart.service';
import {
  ApiCustomerRegisterEndpoint,
  ApiCustomerLoginEndpoint,
} from './decorators/swagger-customer.decorator';

@ApiTags('Clientes')
@Controller('cliente')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly jwtService: JwtService,
    private readonly cartService: CartService,
  ) {}

  @Post('registro')
  @ApiCustomerRegisterEndpoint()
  async register(@Body() body: RegisterAuthDto) {
    const existing = await this.customersService.findByEmail(body.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashed = await hashPassword(body.password);

    const user = await this.customersService.createUser({
      email: body.email,
      password: hashed,
      name: body.name,
      role: 'client',
    });

    const customerId = String(user._id);
    await this.cartService.ensureActiveCart(customerId);

    const payload = { sub: user._id, email: user.email, role: 'client' };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'User registered successfully',
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  @Post('login')
  @HttpCode(200)
  @ApiCustomerLoginEndpoint()
  async login(@Body() body: LoginAuthDto) {
    const user = await this.customersService.findByEmail(body.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await verifyPassword(body.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const customerId = String(user._id);
    await this.cartService.ensureActiveCart(customerId);

    const payload = { sub: user._id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'User logged in successfully',
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
