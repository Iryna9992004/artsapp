import { MessageRepositoryPostgres } from '../infrastructure/repos/message.repository';

export class GetMessagesUsecase {
  constructor(private readonly messageRepository: MessageRepositoryPostgres) {}

  async execute(topic_id: number) {
    return this.messageRepository.get(topic_id);
  }
}
