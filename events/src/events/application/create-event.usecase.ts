import { Injectable } from '@nestjs/common';
import { EventRepositoryPostgres } from '../infrastructure/repos/event.repository';

@Injectable()
export class CreateEventsecase {
  constructor(private readonly eventRepository: EventRepositoryPostgres) {}

  async exec(title: string, event_description: string, user_id: number) {
    return this.eventRepository.create(title, event_description, user_id);
  }
}
