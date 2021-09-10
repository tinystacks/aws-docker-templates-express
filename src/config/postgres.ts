import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PG_HOST || 'crud-api-1.c9nq6suhmqou.us-east-1.rds.amazonaws.com',
  port: parseInt(process.env.PG_PORT || '5432'),
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  database: process.env.PG_DATABASE || 'postgres',
});

export { pool };