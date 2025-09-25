import { Injectable } from '@nestjs/common';
import { TopicReadRepository } from 'src/chat/domain/repos/topic.read.repository';
import { PgService } from 'src/pg/pg.service';

@Injectable()
export class TopicReadRepositoryPostgres implements TopicReadRepository {
  constructor(private readonly pgService: PgService) {}

  async markAsRead(
    user_id: number,
    topic_id: number,
  ): Promise<TopicReadRepository> {
    const client = this.pgService.getPool();
    const result = await client.query(
      'INSERT INTO topic_reads (topic_id, user_id) VALUES ($1, $2) RETURNING *',
      [topic_id, user_id],
    );
    return result.rows[0];
  }
}
