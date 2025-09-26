import { Module } from '@nestjs/common';
import { PgModule } from 'src/pg/pg.module';
import { TopicRepositoryPostgres } from './infrastructure/repos/topic.repository';
import { CreateTopicUsecase } from './application/create.topic.usecase';
import { ChatController } from './interface/chat.controller';
import { ChatGateway } from './infrastructure/services/chat.gateway';
import { ReadTopicUsecase } from './application/read.topic.usecase';
import { TopicReadRepositoryPostgres } from './infrastructure/repos/topic.read.repository';
import { MessageRepositoryPostgres } from './infrastructure/repos/message.repository';
import { ReadMessageRepositoryPostgres } from './infrastructure/repos/read.message.repository';
import { CreateMessageUsecase } from './application/create.message.usecase';
import { ReadMessageUsecase } from './application/read.message.usecase';
import { GetMessagesUsecase } from './application/get.messages.usecase';

@Module({
  imports: [PgModule],
  providers: [
    TopicRepositoryPostgres,
    TopicReadRepositoryPostgres,
    MessageRepositoryPostgres,
    ReadMessageRepositoryPostgres,
    CreateTopicUsecase,
    ReadTopicUsecase,
    CreateMessageUsecase,
    ReadMessageUsecase,
    GetMessagesUsecase,
    ChatGateway,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
