import { Module } from '@nestjs/common';
import { PgModule } from './pg/pg.module';

@Module({
  imports: [PgModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
