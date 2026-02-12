import { Injectable } from '@nestjs/common';
import { MessageRepositoryPostgres } from '../infrastructure/repos/message.repository';
import { UserRepositoryPostgres } from 'src/auth/infrastructure/repos/user.repository';
import { RMQService } from 'nestjs-rmq';

@Injectable()
export class CreateMessageUsecase {
  constructor(
    private readonly messageRepository: MessageRepositoryPostgres,
    private readonly userRepository: UserRepositoryPostgres,
    private readonly rmqService: RMQService,
  ) {}

  async exec(text: string, topic_id: number, user_id: number) {
    const message = await this.messageRepository.create(text, topic_id, user_id);
    
    // Send notification to user's email
    try {
      const user = await this.userRepository.findById(user_id);
      if (user && user.email) {
        await this.rmqService.notify('notify', {
          type: 'message',
          title: 'Повідомлення відправлено',
          description: `Ваше повідомлення успішно відправлено: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`,
          email: user.email,
        });
      }
    } catch (error) {
      console.error('Failed to send message notification:', error);
      // Don't throw error, just log it
    }
    
    return message;
  }
}
