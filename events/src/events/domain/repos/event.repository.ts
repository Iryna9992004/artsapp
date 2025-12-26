import { EventEntity } from '../entities/event.entity';

export interface EventRepository {
  create(
    title: string,
    event_description: string,
    user_id: number,
  ): Promise<EventEntity>;
}
