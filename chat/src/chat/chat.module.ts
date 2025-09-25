import { Module } from '@nestjs/common';
import { PgModule } from 'src/pg/pg.module';
import { TopicRepositoryPostgres } from './infrastructure/repos/topic.repository';
import { CreateTopicUsecase } from './application/create.topic.usecase';
import { ChatController } from './interface/chat.controller';

@Module({
  imports: [PgModule],
  providers: [TopicRepositoryPostgres, CreateTopicUsecase],
  controllers: [ChatController],
})
export class ChatModule {}
