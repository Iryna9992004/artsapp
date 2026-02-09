import { Module } from '@nestjs/common';
import { TopicRepositoryClickhouse } from './infrastructure/repos/topics.repository';
import { SearchTopicUsecase } from './application/searchTopics.usecase';
import { TopicsController } from './interface/topics.controller';
import { ClickhouseModule } from 'src/clickhouse/clickhouse.module';
import { FetchTopicUsecase } from './application/fetchTopic.usecase';

@Module({
  providers: [TopicRepositoryClickhouse, SearchTopicUsecase, FetchTopicUsecase],
  controllers: [TopicsController],
  imports: [ClickhouseModule],
})
export class TopicsModule {}
