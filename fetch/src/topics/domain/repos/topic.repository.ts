import { Topic } from '../entities/topic.entity';

export interface TopicRepository {
  search(): Promise<Topic[]>;
}
