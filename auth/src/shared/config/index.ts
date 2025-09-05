import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
  clickhouse: {
    host: string;
    username: string;
    password: string;
    db: string;
  };
}

const config: Config = {
  clickhouse: {
    host: process.env.CLICKHOUSE_HOST,
    username: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD,
    db: process.env.CLICKHOUSE_DB,
  },
};

export default config;
