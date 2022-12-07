import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: join(__dirname, `.env.${process.env.NODE_ENV || 'development'}`),
});

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.POSTGRES_PORT!,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, 'src/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'src/migrations/**/*{.ts,.js}')],
  synchronize: false,
});
