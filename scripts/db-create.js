const path = require('node:path');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

const nodeEnv = process.env.NODE_ENV ?? 'development';
dotenv.config({
  path: path.join(process.cwd(), `.env.${nodeEnv}`),
});

const database = process.env.DB_DATABASE ?? 'nestjsvue';

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? '3306'),
    user: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? 'mysql',
    multipleStatements: true,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  console.log(`Database "${database}" sudah siap.`);
  await connection.end();
}

main().catch((err) => {
  console.error('Gagal membuat database:', err.message);
  process.exit(1);
});