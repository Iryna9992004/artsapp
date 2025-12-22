import { Injectable } from '@nestjs/common';
import { ClickhouseService } from 'src/clickhouse/clickhouse.service';
import { config } from 'src/shared/config/env';
import { Topic } from 'src/topics/domain/entities/topic.entity';
import { TopicRepository } from 'src/topics/domain/repos/topic.repository';

@Injectable()
export class TopicRepositoryClickhouse implements TopicRepository {
  constructor(private readonly clickhouseService: ClickhouseService) {}

  async search(limit: number, offset: number, text?: string): Promise<Topic[]> {
    try {
      if (text && text.length > 0) {
        const rows = await this.clickhouseService.getConfig().query({
          query: `SELECT t.*,
          ifNull(r.reads_count, 0) AS reads_count 
          FROM ${config.db.name}.topics t
          LEFT JOIN (
            SELECT
              topic_id,
              count() AS reads_count
            FROM ${config.db.name}.topic_reads
            GROUP BY topic_id
          ) r
          ON r.topic_id = t.id
          WHERE text LIKE '${text}%' 
          ORDER BY id OFFSET ${limit} 
          ROW FETCH FIRST ${offset} ROWS ONLY`,
          format: 'JSONEachRow',
        });

        const topics = await rows.json<Topic>();
        return topics;
      }
      const rows = await this.clickhouseService.getConfig().query({
        query: `SELECT * FROM ${config.db.name}.topics ORDER BY id OFFSET ${limit} ROW FETCH FIRST ${offset} ROWS ONLY`,
        format: 'JSONEachRow',
      });

      const topics = await rows.json<Topic>();
      return topics;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
