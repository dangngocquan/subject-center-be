import { registerAs } from '@nestjs/config';

export interface AESConfig {
  key: string;
  iv: string;
}

export default registerAs<AESConfig>('aes', () => ({
  key: process.env.AES_KEY || '',
  iv: process.env.AES_IV || '',
}));
