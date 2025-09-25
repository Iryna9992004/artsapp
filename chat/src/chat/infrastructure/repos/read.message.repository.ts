import { ReadMessageEntity } from 'src/chat/domain/entities/read.message.entity';
import { ReadMessageRepository } from 'src/chat/domain/repos/read.message.repository';
import { PgService } from 'src/pg/pg.service';

export class ReadMessageRepositoryPostgres implements ReadMessageRepository {
  constructor(private readonly pgService: PgService) {}

  async markAsRead(
    user_id: number,
    message_id: number,
  ): Promise<ReadMessageEntity> {
    const client = this.pgService.getPool();

    const result = await client.query(
      'INSERT INTO message_reads (topic_id, user_id) VALUES ($1, $2) RETURNING *',
      [user_id, message_id],
    );

    return result.rows[0];
  }
}
