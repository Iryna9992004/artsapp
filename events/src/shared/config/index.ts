import * as dotenv from 'dotenv';
dotenv.config();

export interface Config {
  base: {
    port: number;
  };
  pg: {
    user: string;
    host: string;
    name: string;
    password: string;
    port: number;
  };
  frontend: {
    url: string;
  };
}

export const config: Config = {
  base: {
    port: Number(process.env.PORT),
  },
  pg: {
    user: process.env.PG_USER || '',
    host: process.env.PG_HOST || '',
    name: process.env.PG_NAME || '',
    password: process.env.PG_PASSWORD || '',
    port: Number(process.env.PG_PORT),
  },
  frontend: {
    url: process.env.FRONTEND_URL || '',
  },
};
