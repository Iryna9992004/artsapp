import { Module } from '@nestjs/common';
import { PgModule } from 'src/pg/pg.module';
import { TopicRepositoryPostgres } from './infrastructure/repos/topic.repository';
import { CreateTopicUsecase } from './application/topics/create.topic.usecase';
import { ChatController } from './interface/chat.controller';
import { ChatGateway } from './infrastructure/services/chat.gateway';
import { ReadTopicUsecase } from './application/topics/read.topic.usecase';
import { TopicReadRepositoryPostgres } from './infrastructure/repos/topic.read.repository';

@Module({
  imports: [PgModule],
  providers: [
    TopicRepositoryPostgres,
    TopicReadRepositoryPostgres,
    CreateTopicUsecase,
    ReadTopicUsecase,
    ChatGateway,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
