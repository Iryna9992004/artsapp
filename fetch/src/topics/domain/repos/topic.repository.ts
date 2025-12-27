import { Topic } from '../entities/topic.entity';

export interface TopicRepository {
  search(limit: number, offset: number): Promise<Topic[]>;
  getTopicById(topic_id: number): Promise<Topic>;
}
