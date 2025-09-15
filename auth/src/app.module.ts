import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClickhouseModule } from './clickhouse/clickhouse.module';
import { PgModule } from './pg/pg.module';

@Module({
  controllers: [],
  providers: [],
  imports: [AuthModule, ClickhouseModule, PgModule],
})
export class AppModule {}
