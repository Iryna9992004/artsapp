import { EventEntity } from '../entities/event.entity';

export interface EventRepository {
  getEvents(limit: number, offset: number): Promise<EventEntity[]>;
}
