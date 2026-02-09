import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { PgModule } from 'src/pg/pg.module';
import { CreateEventsecase } from '../application/create-event.usecase';
import { EventRepositoryPostgres } from '../infrastructure/repos/event.repository';

@Module({
  controllers: [EventsController],
  providers: [CreateEventsecase, EventRepositoryPostgres],
  imports: [PgModule],
})
export class EventsModule {}
