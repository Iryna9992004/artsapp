import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
  base: {
    port: number;
  };
  clickhouse: {
    host: string;
    username: string;
    password: string;
    db: string;
  };
  jwt: {
    access_secret: string;
    refresh_secret: string;
  };
  pg: {
    name: string;
    user: string;
    password: string;
    host: string;
    port: number;
    type: string;
  };
  redis: {
    host: string;
    port: number;
    password: string;
  };
  client: {
    base_url: string;
  };
}

const config: Config = {
  base: {
    port: Number(process.env.PORT) || 4000,
  },
  clickhouse: {
    host: process.env.CLICKHOUSE_HOST,
    username: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD,
    db: process.env.CLICKHOUSE_DB,
  },
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    refresh_secret: process.env.JWT_RESRESH_SECRET,
  },
  pg: {
    name: process.env.PG_NAME,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    type: process.env.DB_TYPE,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
  client: {
    base_url: process.env.CLIENT_BASE_URL,
  },
};

export default config;
