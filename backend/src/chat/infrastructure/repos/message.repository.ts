import { Injectable } from '@nestjs/common';
import { MessageEntity } from 'src/chat/domain/entities/message.entity';
import { MessageRepository } from 'src/chat/domain/repos/message.repository';
import { PgService } from 'src/pg/pg.service';

@Injectable()
export class MessageRepositoryPostgres implements MessageRepository {
  constructor(private readonly pgService: PgService) {}

  async getAll(topic_id: number): Promise<MessageEntity[]> {
    const client = this.pgService.getPool();

    const result = await client.query(
      `SELECT
      m.id,
      m.text,
      m.created_at,
      m.user_id,
      m.topic_id,
      u.full_name AS author_name,
      COALESCE(mr.reads_count, 0) AS reads_count
    FROM messages m
    LEFT JOIN users u ON u.id = m.user_id
    LEFT JOIN LATERAL (
      SELECT
        COUNT(*) AS reads_count
      FROM message_reads
      WHERE message_id = m.id
    ) mr ON true
    WHERE m.topic_id = $1
    ORDER BY m.created_at ASC`,
      [topic_id],
    );
    return result.rows;
  }

  async create(
    text: string,
    topic_id: number,
    user_id: number,
  ): Promise<MessageEntity> {
    const client = this.pgService.getPool();
    const result = await client.query(
      'INSERT INTO messages (text, topic_id, user_id) VALUES ($1, $2, $3) RETURNING *',
      [text, topic_id, user_id],
    );
    return result.rows[0];
  }
}
