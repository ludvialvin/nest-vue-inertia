import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CreateUsers1700000000000 } from './migrations/1700000000000-CreateUsers';

const nodeEnv = process.env.NODE_ENV ?? 'development';
dotenv.config({ path: `.env.${nodeEnv}` });

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? '3306'),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? 'mysql',
  database: process.env.DB_DATABASE ?? 'nestjsvue',
  entities: [User],
  migrations: [CreateUsers1700000000000],
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
});
