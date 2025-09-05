import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClickhouseModule } from './clickhouse/clickhouse.module';

@Module({
  controllers: [],
  providers: [],
  imports: [AuthModule, ClickhouseModule],
})
export class AppModule {}
