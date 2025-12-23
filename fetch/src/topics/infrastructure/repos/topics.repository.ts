import { Injectable } from '@nestjs/common';
import { ClickhouseService } from 'src/clickhouse/clickhouse.service';
import { config } from 'src/shared/config/env';
import { Topic } from 'src/topics/domain/entities/topic.entity';
import { TopicRepository } from 'src/topics/domain/repos/topic.repository';

@Injectable()
export class TopicRepositoryClickhouse implements TopicRepository {
  constructor(private readonly clickhouseService: ClickhouseService) {}

  async search(offset: number, limit: number, text?: string): Promise<Topic[]> {
    try {
      if (text && text.length > 0) {
        const rows = await this.clickhouseService.getConfig().query({
          query: `SELECT t.*,
      u.full_name AS author_name,
      ifNull(r.reads_count, 0) AS reads_count 
      FROM ${config.db.name}.topics t
      LEFT JOIN ${config.db.name}.users u ON u.id = t.user_id
      LEFT JOIN (
        SELECT
          topic_id,
          count() AS reads_count
        FROM ${config.db.name}.topic_reads
        GROUP BY topic_id
      ) r ON r.topic_id = t.id
      WHERE t.text LIKE '${text}%' 
      ORDER BY t.id 
      LIMIT ${limit} 
      OFFSET ${offset}`,
          format: 'JSONEachRow',
        });

        const topics = await rows.json<Topic>();
        return topics;
      }
      const rows = await this.clickhouseService.getConfig().query({
        query: `SELECT t.*,
        u.full_name AS author_name,
        ifNull(r.reads_count, 0) AS reads_count
        FROM ${config.db.name}.topics t
        LEFT JOIN ${config.db.name}.users u ON u.id = t.user_id
        LEFT JOIN (
          SELECT 
            topic_id,
            count() AS reads_count
          FROM ${config.db.name}.topic_reads
          GROUP BY topic_id
        ) r ON r.topic_id = t.id
        ORDER BY t.id 
        LIMIT ${limit} 
        OFFSET ${offset}`,
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
