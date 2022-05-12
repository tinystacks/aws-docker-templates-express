import * as mysql from 'mysql2';

const basePool = mysql.createPool({
  host: process.env.PG_HOST || '0.0.0.0',
  port: parseInt(process.env.PG_PORT || '5432'),
  user: process.env.PG_USERNAME || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  database: process.env.PG_DATABASE || 'postgres',
});

export const pool = basePool.promise();
