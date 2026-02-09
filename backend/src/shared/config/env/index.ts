import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
  base: {
    port: number;
  };
  frontend: {
    url: string;
  };
  clickhouse: {
    url: string;
  };
  db: {
    name: string;
  };
}

function getClickHouseUrl(): string {
  if (process.env.CLICKHOUSE_URL) {
    return process.env.CLICKHOUSE_URL;
  }

  const hostRaw = process.env.CLICKHOUSE_HOST || 'localhost';
  const port = process.env.CLICKHOUSE_PORT || '8123';
  const username = process.env.CLICKHOUSE_USER || 'clickhouse';
  const password = process.env.CLICKHOUSE_PASSWORD || '1111';
  const database = process.env.CLICKHOUSE_DB || 'clickhouse';
  const protocol = process.env.CLICKHOUSE_PROTOCOL || 'http';

  // Якщо CLICKHOUSE_HOST вже містить протокол (http:// або https://), парсимо його
  let host = hostRaw;
  let finalPort = port;
  
  if (hostRaw.startsWith('http://') || hostRaw.startsWith('https://')) {
    try {
      const url = new URL(hostRaw);
      host = url.hostname;
      finalPort = url.port || port;
      const finalProtocol = url.protocol.replace(':', '');
      return `${finalProtocol}://${username}:${password}@${host}:${finalPort}/${database}`;
    } catch (e) {
      // Якщо парсинг не вдався, просто видаляємо протокол вручну
      host = hostRaw.replace(/^https?:\/\//, '').split(':')[0];
    }
  }

  return `${protocol}://${username}:${password}@${host}:${finalPort}/${database}`;
}

export const config: Config = {
  base: {
    port: Number(process.env.PORT) || 4003,
  },
  frontend: {
    url: process.env.FRONTEND_URL || '',
  },
  clickhouse: {
    url: getClickHouseUrl(),
  },
  db: {
    name: process.env.DB_NAME || '',
  },
};
