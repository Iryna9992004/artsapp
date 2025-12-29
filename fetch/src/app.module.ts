import { Module } from '@nestjs/common';
import { TopicsModule } from './topics/topics.module';
import { EventsModule } from './events/events.module';
import { PostsModule } from './posts/interface/posts.module';

@Module({
  imports: [TopicsModule, EventsModule, PostsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
