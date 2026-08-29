import 'dotenv/config';
import { Log } from 'src/log/log.entity';

import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',

  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,

  entities: [Log],

  migrations: [
    'src/database/migrations/*.ts',
  ],
});