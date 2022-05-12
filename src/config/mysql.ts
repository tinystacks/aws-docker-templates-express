import * as mysql from 'mysql2';

const basePool = mysql.createPool({
  host: process.env.MYSQL_HOST || '0.0.0.0',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USERNAME || 'mysql',
  password: process.env.MYSQL_PASSWORD || 'mysql',
  database: process.env.MYSQL_DATABASE || 'mysql',
});

export const pool = basePool.promise();
