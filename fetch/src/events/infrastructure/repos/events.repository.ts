import { Injectable } from '@nestjs/common';
import { ClickhouseService } from 'src/clickhouse/clickhouse.service';
import { EventEntity } from 'src/events/domain/entities/event.entity';
import { EventRepository } from 'src/events/domain/repos/event.repository';
import { config } from 'src/shared/config/env';

@Injectable()
export class EventsRepositoryCLickhouse implements EventRepository {
  constructor(private readonly clickhouseService: ClickhouseService) {}

  async getEvents(
    limit: number,
    offset: number,
    text?: string,
  ): Promise<EventEntity[]> {
    if (text && text.length > 0) {
      const rows = await this.clickhouseService.getConfig().query({
        query: `SELECT t.*,
              u.full_name AS author_name
              FROM ${config.db.name}.events t
              LEFT JOIN ${config.db.name}.users u ON u.id = t.user_id
              WHERE t.title LIKE '${text}%' OR t.event_description LIKE '${text}%'
              ORDER BY t.id 
              LIMIT ${limit} 
              OFFSET ${offset}`,
        format: 'JSONEachRow',
      });

      const events = await rows.json<EventEntity>();
      return events;
    }

    const rows = await this.clickhouseService.getConfig().query({
      query: `SELECT t.*,
              u.full_name AS author_name
              FROM ${config.db.name}.events t
              LEFT JOIN ${config.db.name}.users u ON u.id = t.user_id
              ORDER BY t.id 
              LIMIT ${limit} 
              OFFSET ${offset}`,
      format: 'JSONEachRow',
    });

    const events = await rows.json<EventEntity>();
    return events;
  }
}
