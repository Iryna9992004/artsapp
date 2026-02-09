import { Module } from '@nestjs/common';
import { EventsController } from './interface/events.controller';
import { EventsRepositoryCLickhouse } from './infrastructure/repos/events.repository';
import { GetEventUsecase } from './application/get-event.usecase';
import { ClickhouseModule } from 'src/clickhouse/clickhouse.module';

@Module({
  controllers: [EventsController],
  providers: [EventsRepositoryCLickhouse, GetEventUsecase],
  imports: [ClickhouseModule],
})
export class EventsModule {}
