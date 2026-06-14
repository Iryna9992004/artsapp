import { Injectable } from '@nestjs/common';
import { ClickhouseService } from 'src/clickhouse/clickhouse.service';
import { EventEntity } from 'src/fetch-events/domain/entities/event.entity';
import { EventRepository } from 'src/fetch-events/domain/repos/event.repository';
import { config } from 'src/shared/config/env';

@Injectable()
export class EventsRepositoryCLickhouse implements EventRepository {
  constructor(private readonly clickhouseService: ClickhouseService) {}

  async getEvents(
    limit: number,
    offset: number,
    text?: string,
  ): Promise<EventEntity[]> {
    const hasText = !!(text && text.length > 0);

    // Фільтрація винесена в підзапит ДО JOIN: інакше движок
    // MaterializedPostgreSQL (віртуальна колонка _sign) + LEFT JOIN + OR-умова
    // падає з NOT_FOUND_COLUMN_IN_BLOCK.
    const query = `SELECT t.*,
              u.full_name AS author_name
              FROM (
                SELECT *
                FROM ${config.db.name}.events
                ${
                  hasText
                    ? `WHERE title ILIKE {searchPattern:String} OR event_description ILIKE {searchPattern:String}`
                    : ''
                }
              ) t
              LEFT JOIN ${config.db.name}.users u ON u.id = t.user_id
              ORDER BY t.id DESC
              LIMIT {limit:UInt32}
              OFFSET {offset:UInt32}`;

    const query_params: Record<string, unknown> = {
      limit: Number(limit),
      offset: Number(offset),
    };
    if (hasText) {
      query_params.searchPattern = `${text}%`;
    }

    const rows = await this.clickhouseService.getConfig().query({
      query,
      format: 'JSONEachRow',
      query_params,
    });

    const events = await rows.json<EventEntity>();
    return events;
  }
}
