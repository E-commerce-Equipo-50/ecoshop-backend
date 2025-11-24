import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { CustomersService } from '../customers/customers.service';
import { SellersService } from '../sellers/sellers.service';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly customersService: CustomersService,
    private readonly sellersService: SellersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'jwt_default_secret',
    });
  }

  async validate(payload: JwtPayload) {
    let user: any = null;
    if (payload.role === 'seller') {
      user = await this.sellersService.findById(payload.sub);
    } else {
      user = await this.customersService.findById(payload.sub);
    }

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return {
      id: user._id?.toString(),
      email: user.email,
      role: user.role,
      name: (user as any).name ?? (user as any).brandName ?? null,
    };
  }
}
