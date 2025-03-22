import { registerAs } from '@nestjs/config';

export interface SecurityConfig {
  secret: string;
  adminPassword: string;
}

export default registerAs<SecurityConfig>('security', () => ({
  secret: process.env.APP_SECRET || '',
  adminPassword: process.env.APP_ADMIN_PASSWORD || '',
}));
