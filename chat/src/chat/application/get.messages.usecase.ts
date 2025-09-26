import { Injectable } from '@nestjs/common';
import { MessageRepositoryPostgres } from '../infrastructure/repos/message.repository';

@Injectable()
export class GetMessagesUsecase {
  constructor(private readonly messageRepository: MessageRepositoryPostgres) {}

  async execute(topic_id: number) {
    return this.messageRepository.getAll(topic_id);
  }
}
