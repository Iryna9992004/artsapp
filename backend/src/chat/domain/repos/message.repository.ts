import { MessageEntity } from '../entities/message.entity';

export interface MessageRepository {
  getAll(topic_id: number): Promise<MessageEntity[]>;
  create(
    text: string,
    topic_id: number,
    user_id: number,
  ): Promise<MessageEntity>;
}
