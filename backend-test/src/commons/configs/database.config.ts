import { registerAs } from '@nestjs/config';

export const dbConfig = registerAs('database', () => ({
  port: +process.env.DB_PORT || 3000,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
}));
