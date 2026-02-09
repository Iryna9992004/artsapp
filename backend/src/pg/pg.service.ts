import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import config from 'src/shared/config';

@Injectable()
export class PgService {
  private pool: Pool;

  constructor() {
    const poolConfig = {
      user: config.pg.user,
      host: config.pg.host,
      database: config.pg.name,
      password: config.pg.password,
      port: config.pg.port,
    };
    this.pool = new Pool(poolConfig);
  }

  getPool(): Pool {
    return this.pool;
  }
}
