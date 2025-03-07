import { registerAs } from '@nestjs/config';

export interface PostgresConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export default registerAs<PostgresConfig>('postgresql', () => ({
  host: process.env.POSTGRES_HOST || '',
  port: parseInt(process.env.POSTGRES_PORT || '0'),
  username: process.env.POSTGRES_USERNAME || '',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DATABASE || '',
}));
