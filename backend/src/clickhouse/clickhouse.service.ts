import { Injectable } from '@nestjs/common';
import { createClient } from '@clickhouse/client';
import { config } from 'src/shared/config/env';

@Injectable()
export class ClickhouseService {
  getConfig() {
    return createClient({
      url: config.clickhouse.url,
    });
  }
}
