import { Injectable } from '@nestjs/common';
import { TopicRepositoryPostgres } from '../infrastructure/repos/topic.repository';
import { UserRepositoryPostgres } from 'src/auth/infrastructure/repos/user.repository';
import { RMQService } from 'nestjs-rmq';

@Injectable()
export class CreateTopicUsecase {
  constructor(
    private readonly topicRepository: TopicRepositoryPostgres,
    private readonly userRepository: UserRepositoryPostgres,
    private readonly rmqService: RMQService,
  ) {}

  async execute(text: string, user_id: number) {
    const res = await this.topicRepository.create(text, user_id);
    
    // Send notification to user's email
    try {
      const user = await this.userRepository.findById(user_id);
      if (user && user.email) {
        await this.rmqService.notify('notify', {
          type: 'topic',
          title: 'Нова тема створена',
          description: `Ви успішно створили нову тему: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`,
          email: user.email,
        });
      }
    } catch (error) {
      console.error('Failed to send topic creation notification:', error);
      // Don't throw error, just log it
    }
    
    return res;
  }
}
