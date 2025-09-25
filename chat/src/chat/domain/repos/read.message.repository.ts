import { ReadMessageEntity } from '../entities/read.message.entity';

export interface ReadMessageRepository {
  markAsRead(user_id: number, message_id: number): Promise<ReadMessageEntity>;
}
