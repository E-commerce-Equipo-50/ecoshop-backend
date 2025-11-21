import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'jwt_default_secret',
  expiresIn: process.env.EXPIRES_IN || '24h',
}));
