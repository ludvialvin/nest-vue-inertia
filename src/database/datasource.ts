import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

const envPath = `.env.${process.env.NODE_ENV ?? 'development'}`;
dotenv.config({ path: envPath });

const db_type: any = process.env.DB_TYPE;

const db_host = process.env.DB_HOST_MYSQL;
const db_port: number = process.env.DB_PORT_MYSQL
  ? parseInt(process.env.DB_PORT_MYSQL)
  : 3306;
const db_user = process.env.DB_USERNAME_MYSQL;
const db_pass = process.env.DB_PASSWORD_MYSQL;
const db_name = process.env.DB_NAME_MYSQL;

export const DBSource = new DataSource({
  type: 'mysql',
  host: db_host,
  port: db_port,
  username: db_user,
  password: db_pass,
  database: db_name,
  synchronize: false,
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  entities: ['dist/entity/*{.ts,.js}'],
  logger: 'debug',
});
