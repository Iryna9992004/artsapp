import { Module } from '@nestjs/common';
import { TopicsModule } from './topics/topics.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [TopicsModule, EventsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
