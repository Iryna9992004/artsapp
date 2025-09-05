import { Module } from '@nestjs/common';
import { ClickHouseModule } from '@depyronick/nestjs-clickhouse';

@Module({
  imports: [
    ClickHouseModule.register([
      {
        name: 'clickhouse-server',
        host: 'localhost',
        password: 'dvsdssvdvsd',
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
