import { registerAs } from '@nestjs/config';

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
}

export default registerAs<GoogleConfig>('google', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
}));
