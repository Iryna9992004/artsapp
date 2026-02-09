import { EventEntity } from '../entities/event.entity';

export interface EventRepository {
  getEvents(limit: number, offset: number, text?: string): Promise<EventEntity[]>;
}
