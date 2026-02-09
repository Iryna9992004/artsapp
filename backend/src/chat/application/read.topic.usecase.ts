import { Injectable } from '@nestjs/common';
import { TopicReadRepositoryPostgres } from 'src/chat/infrastructure/repos/topic.read.repository';

@Injectable()
export class ReadTopicUsecase {
  constructor(
    private readonly topicReadRepository: TopicReadRepositoryPostgres,
  ) {}

  async execute(user_id: number, topic_id: number) {
    return this.topicReadRepository.markAsRead(user_id, topic_id);
  }
}
