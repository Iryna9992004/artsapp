import { Injectable } from '@nestjs/common';
import { TopicRepositoryClickhouse } from '../infrastructure/repos/topics.repository';

@Injectable()
export class FetchTopicUsecase {
  constructor(private readonly topicRepository: TopicRepositoryClickhouse) {}

  async exec(topic_id: number) {
    const topic = await this.topicRepository.getTopicById(topic_id);
    return topic;
  }
}
