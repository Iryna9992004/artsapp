import { Injectable } from '@nestjs/common';
import { EventRepositoryPostgres } from '../infrastructure/repos/event.repository';
import { RMQService } from 'nestjs-rmq';

@Injectable()
export class CreateEventsecase {
  constructor(
    private readonly eventRepository: EventRepositoryPostgres,
    private readonly rmqService: RMQService,
  ) {}

  async exec(title: string, event_description: string, user_id: number) {
    const response = await this.eventRepository.create(
      title,
      event_description,
      user_id,
    );
    await this.rmqService.notify('notify', {
      title: response.title,
      description: response.event_description,
    });
    return response;
  }
}
