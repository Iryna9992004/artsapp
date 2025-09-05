import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
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
}

const config: Config = {
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
};

export default config;
