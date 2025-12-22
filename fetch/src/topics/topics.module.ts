import { Module } from '@nestjs/common';
import { TopicRepositoryClickhouse } from './infrastructure/repos/topics.repository';
import { SearchTopicUsecase } from './infrastructure/services/searchTopics.usecase';
import { TopicsController } from './interface/topics.controller';
import { ClickhouseModule } from 'src/clickhouse/clickhouse.module';

@Module({
  providers: [TopicRepositoryClickhouse, SearchTopicUsecase],
  controllers: [TopicsController],
  imports: [ClickhouseModule],
})
export class TopicsModule {}
