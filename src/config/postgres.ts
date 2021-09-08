const pgCreds = {
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  hostname: process.env.PG_HOSTNAME,
  port: process.env.PG_PORT
}

export { pgCreds }