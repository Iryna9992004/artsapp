import { Injectable } from '@nestjs/common';
import { TopicRepositoryPostgres } from '../infrastructure/repos/topic.repository';

@Injectable()
export class CreateTopicUsecase {
  constructor(private readonly topicRepository: TopicRepositoryPostgres) {}

  async execute(text: string, user_id: number) {
    const res = await this.topicRepository.create(text, user_id);
    return res;
  }
}
