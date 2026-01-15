import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
  base: {
    port: number;
  };
  pg: {
    name: string;
    user: string;
    password: string;
    host: string;
    port: number;
    type: string;
  };
}

const config: Config = {
  base: {
    port: Number(process.env.PORT) || 4000,
  },
  pg: {
    name: process.env.PG_NAME || '',
    user: process.env.PG_USER || '',
    password: process.env.PG_PASSWORD || '',
    host: process.env.PG_HOST || '',
    port: Number(process.env.PG_PORT) || 5173,
    type: process.env.DB_TYPE || '',
  },
};

export default config;
