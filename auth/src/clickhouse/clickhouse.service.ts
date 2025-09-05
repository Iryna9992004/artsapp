import { Injectable } from '@nestjs/common';
import config from 'src/shared/config';
import { createClient } from '@clickhouse/client';

@Injectable()
export class ClickhouseService {
  getConnectionDetails() {
    console.log(
      config.clickhouse.host,
      config.clickhouse.username,
      config.clickhouse.password,
      config.clickhouse.db,
    );
    const client = createClient({
      host: config.clickhouse.host,
      username: config.clickhouse.username,
      password: config.clickhouse.password,
      database: config.clickhouse.db,
    });

    return client;
  }
}
