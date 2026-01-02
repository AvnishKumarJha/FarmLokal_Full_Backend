export const config = {
  port: Number(process.env.PORT) || 3000,

  mysql: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!
  },

  redisUrl: process.env.REDIS_URL!,

  oauth: {
    tokenUrl: process.env.OAUTH_URL!,
    clientId: process.env.OAUTH_CLIENT!,
    clientSecret: process.env.OAUTH_SECRET!
  }
};
