import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  secret: string;
  // nodeEnv: string;
  adminPassword: string;
}

export default registerAs<AppConfig>('app', () => ({
  port: parseInt(process.env.APP_PORT || '0'),
  secret: process.env.APP_SECRET || '',
  // nodeEnv: process.env.NODE_ENV || 'development',
  adminPassword: process.env.APP_ADMIN_PASSWORD || 'no-password',
}));
