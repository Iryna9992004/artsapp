import { Injectable } from '@nestjs/common';
import { Topic } from 'src/chat/domain/entities/topic.entity';
import { TopicRepository } from 'src/chat/domain/repos/topic.repository';
import { PgService } from 'src/pg/pg.service';

@Injectable()
export class TopicRepositoryPostgres implements TopicRepository {
  constructor(private readonly pgService: PgService) {}

  async create(text: string, user_id: any): Promise<Topic> {
    const client = this.pgService.getPool();
    const result = await client.query(
      'INSERT INTO topics (text, user_id) VALUES ($1, $2) RETURNING *',
      [text, user_id],
    );
    return result.rows[0];
  }
}
