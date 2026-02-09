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
  frontend: {
    url: string;
  };
  rabbitmq: {
    host: string;
    port: number;
    user: string;
    password: string;
    exchangeName: string;
  };
}

const config: Config = {
  base: {
    port: Number(process.env.PORT) || 4000,
  },
  clickhouse: {
    host: process.env.CLICKHOUSE_HOST || '',
    username: process.env.CLICKHOUSE_USER || '',
    password: process.env.CLICKHOUSE_PASSWORD || '',
    db: process.env.CLICKHOUSE_DB || '',
  },
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET || '',
    refresh_secret: process.env.JWT_RESRESH_SECRET || '',
  },
  pg: {
    name: process.env.PG_NAME || '',
    user: process.env.PG_USER || '',
    password: process.env.PG_PASSWORD || '',
    host: process.env.PG_HOST || '',
    port: Number(process.env.PG_PORT) || 5432,
    type: process.env.DB_TYPE || 'postgres',
  },
  redis: {
    host: process.env.REDIS_HOST || '',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },
  client: {
    base_url: process.env.CLIENT_BASE_URL || '',
  },
  frontend: {
    url: process.env.FRONTEND_URL || '',
  },
  rabbitmq: {
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: Number(process.env.RABBITMQ_PORT) || 5672,
    user: process.env.RABBITMQ_USER || 'admin',
    password: process.env.RABBITMQ_PASSWORD || '1111',
    exchangeName: process.env.RABBITMQ_EXCHANGE_NAME || 'Notification',
  },
};

export default config;
