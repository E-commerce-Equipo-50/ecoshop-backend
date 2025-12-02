import {
  Controller,
  Body,
  Post,
  HttpCode,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiRegisterEndpoint,
  ApiLoginEndpoint,
  ApiProfileEndpoint,
} from './decorators/swagger-auth.decorator';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiRegisterEndpoint()
  async register(@Body() body: RegisterAuthDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(200)
  @ApiLoginEndpoint()
  async login(@Body() body: LoginAuthDto) {
    return this.authService.login(body);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiProfileEndpoint()
  getProfile(@Request() req: { user: unknown }) {
    return req.user;
  }
}
