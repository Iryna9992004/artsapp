import { Injectable } from '@nestjs/common';
import { TopicRepositoryClickhouse } from '../infrastructure/repos/topics.repository';

@Injectable()
export class SearchTopicUsecase {
  constructor(private readonly topicsRepository: TopicRepositoryClickhouse) {}

  async exec(limit: number, offset: number, searchText?: string) {
    const topics = await this.topicsRepository.search(
      limit,
      offset,
      searchText,
    );
    return topics;
  }
}
