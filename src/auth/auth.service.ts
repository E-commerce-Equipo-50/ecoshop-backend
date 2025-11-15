import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { hashPassword, verifyPassword } from 'src/common/utils/hash.utils';
import { RegisterAuthDto, UserRole } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Register logic
  async register(data: RegisterAuthDto) {
    // Comprobar si existe el usuario
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash de la contrasena
    const hashedPassword = await hashPassword(data.password);

    // Crear el usuario en la bd
    const newUser = await this.usersService.createUser({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: (data.role as UserRole) ?? 'customer',
    });

    // Generar token
    const payload = {
      sub: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'User registered successfully',
      accessToken,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    };
  }

  // Login logic
  async login(data: LoginAuthDto) {
    // Buscar usuario
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar la contrasena
    const validPassword = await verifyPassword(data.password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generar token
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };
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
