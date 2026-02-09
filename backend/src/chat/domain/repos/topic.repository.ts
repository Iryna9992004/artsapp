import { Topic } from '../entities/topic.entity';

export interface TopicRepository {
  create(text: string, user_id): Promise<Topic>;
}
