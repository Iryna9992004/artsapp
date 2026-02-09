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
      let query = `
      SELECT 
        t.id AS id,
        t.text AS text,
        t.created_at AS created_at,
        t.user_id AS user_id,
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
    `;

      const params: Record<string, any> = {
        limit,
        offset,
      };

      if (text && text.trim().length > 0) {
        query += ` WHERE t.text LIKE {searchPattern:String}`;
        params.searchPattern = `%${text.trim()}%`;
      }

      query += ` ORDER BY t.id LIMIT {limit:UInt32} OFFSET {offset:UInt32}`;

      const rows = await this.clickhouseService.getConfig().query({
        query,
        format: 'JSONEachRow',
        query_params: params,
      });

      const topics = await rows.json<Topic>();
      return topics;
    } catch (e) {
      console.error('Error searching topics:', e);
      throw e;
    }
  }

  async getTopicById(topic_id: number): Promise<Topic> {
    try {
      const rows = await this.clickhouseService.getConfig().query({
        query: `SELECT *
              FROM ${config.db.name}.topics
              WHERE id = ${topic_id}
              ORDER BY id`,
        format: 'JSONEachRow',
      });
      const topic = await rows.json<Topic>();
      return topic[0];
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
