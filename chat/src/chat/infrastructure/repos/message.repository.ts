import { MessageEntity } from 'src/chat/domain/entities/message.entity';
import { MessageRepository } from 'src/chat/domain/repos/message.repository';
import { PgService } from 'src/pg/pg.service';

export class MessageRepositoryPostgres implements MessageRepository {
  constructor(private readonly pgService: PgService) {}

  async get(topic_id: number): Promise<MessageEntity[]> {
    const client = this.pgService.getPool();
    const result = await client.query(
      'SELECT * FROM messages WHERE topic_id=($1)',
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
