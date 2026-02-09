import { Injectable } from '@nestjs/common';
import { ReadMessageRepositoryPostgres } from '../infrastructure/repos/read.message.repository';

@Injectable()
export class ReadMessageUsecase {
  constructor(
    private readonly readMessageRepository: ReadMessageRepositoryPostgres,
  ) {}

  async exec(user_id: number, message_id: number) {
    return this.readMessageRepository.markAsRead(user_id, message_id);
  }
}
