import { Injectable } from '@nestjs/common';
import { TopicRepositoryClickhouse } from '../repos/topics.repository';

@Injectable()
export class SearchTopicUsecase {
  constructor(private readonly topicsRepository: TopicRepositoryClickhouse) {}

  async exec() {
    const topics = await this.topicsRepository.search();
    return topics;
  }
}
