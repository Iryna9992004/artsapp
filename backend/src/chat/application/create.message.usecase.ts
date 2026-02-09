import { Injectable } from '@nestjs/common';
import { MessageRepositoryPostgres } from '../infrastructure/repos/message.repository';

@Injectable()
export class CreateMessageUsecase {
  constructor(private readonly messageRepository: MessageRepositoryPostgres) {}

  async exec(text: string, topic_id: number, user_id: number) {
    return this.messageRepository.create(text, topic_id, user_id);
  }
}
