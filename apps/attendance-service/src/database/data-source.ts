import 'dotenv/config';

import { DataSource } from 'typeorm';

import { User } from '../user/user.entity';
import { Attendance } from '../attendance/attendance.entity';
import { Auth } from '../auth/auth.entity';

export default new DataSource({
  type: 'postgres',

  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,

  entities: [User, Attendance, Auth],

  migrations: [
    'src/database/migrations/*.ts',
  ],
});