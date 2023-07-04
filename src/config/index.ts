import * as dotenv from 'dotenv';

process.env.ENV_PATH
  ? dotenv.config({ path: process.env.ENV_PATH })
  : dotenv.config();

export const config = {
  port: process.env.PORT || 2300,
  host: process.env.PG_HOST,
  db: {
    port: process.env.PGPORT,
    host: process.env.PGHOST,
    username: process.env.PGUSERNAME,
    password: process.env.PGPASSWORD,
    databaseName: process.env.PGDATABASE,
    logging: process.env.DATABASE_LOGGING,
  },
  secret_access_token: process.env.ACCESS_TOKEN_SECRET,
  secret_refresh_token: process.env.REFRESH_TOKEN_SECRET,
};
