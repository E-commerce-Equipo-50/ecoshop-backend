import {
  Controller,
  Body,
  Post,
  HttpCode,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterAuthDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginAuthDto) {
    return this.authService.login(body);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: { user: unknown }) {
    return req.user;
  }

  @Get('admin/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAdminDashboard() {
    return { message: 'Welcome, admin' };
  }
}
