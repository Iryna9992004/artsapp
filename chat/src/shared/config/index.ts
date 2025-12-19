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
  client: {
    base_url: string;
  };
}

const config: Config = {
  pg: {
    name: process.env.PG_NAME,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    type: process.env.DB_TYPE,
  },
  client: {
    base_url: process.env.CLIENT_BASE_URL,
  },
};

export default config;
