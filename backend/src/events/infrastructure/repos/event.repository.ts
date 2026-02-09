import { Injectable } from '@nestjs/common';
import { EventEntity } from 'src/events/domain/entities/event.entity';
import { EventRepository } from 'src/events/domain/repos/event.repository';
import { PgService } from 'src/pg/pg.service';

@Injectable()
export class EventRepositoryPostgres implements EventRepository {
  constructor(private readonly pgService: PgService) {}
  async create(
    title: string,
    event_description: string,
    user_id: number,
  ): Promise<EventEntity> {
    const client = this.pgService.getPool();

    const result = await client.query(
      'INSERT INTO events (title, event_description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, event_description, user_id],
    );

    return result.rows[0] as EventEntity;
  }
}
