import { Injectable } from '@nestjs/common';
import { EventRepositoryPostgres } from '../infrastructure/repos/event.repository';
import { RMQService } from 'nestjs-rmq';
import { UserRepositoryPostgres } from 'src/auth/infrastructure/repos/user.repository';

@Injectable()
export class CreateEventsecase {
  constructor(
    private readonly eventRepository: EventRepositoryPostgres,
    private readonly rmqService: RMQService,
    private readonly userRepository: UserRepositoryPostgres,
  ) {}

  async exec(title: string, event_description: string, user_id: number) {
    const response = await this.eventRepository.create(
      title,
      event_description,
      user_id,
    );
    
    // Send notification to user's email
    try {
      const user = await this.userRepository.findById(user_id);
      if (user && user.email) {
        await this.rmqService.notify('notify', {
          type: 'event',
          title: 'Нова подія створена',
          description: `Ви успішно створили нову подію: "${response.title}"`,
          email: user.email,
        });
      }
    } catch (error) {
      console.error('Failed to send event creation notification:', error);
      // Don't throw error, just log it
    }

    return response;
  }
}
