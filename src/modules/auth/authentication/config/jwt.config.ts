import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
}

export default registerAs<JwtConfig>('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-secret-key',
}));
