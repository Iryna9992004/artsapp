import { Module } from '@nestjs/common';
import { PgModule } from './pg/pg.module';
import { EventsModule } from './events/interface/events.module';

@Module({
  imports: [PgModule, EventsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
