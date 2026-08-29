CREATE DATABASE attendance_postgres;
CREATE DATABASE log_postgres;

\c attendance_postgres;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\c log_postgres;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";