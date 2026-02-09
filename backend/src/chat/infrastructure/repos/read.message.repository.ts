import { Injectable } from '@nestjs/common';
import { ReadMessageEntity } from 'src/chat/domain/entities/read.message.entity';
import { ReadMessageRepository } from 'src/chat/domain/repos/read.message.repository';
import { PgService } from 'src/pg/pg.service';

@Injectable()
export class ReadMessageRepositoryPostgres implements ReadMessageRepository {
  constructor(private readonly pgService: PgService) {}

  async markAsRead(
    user_id: number,
    message_id: number,
  ): Promise<ReadMessageEntity> {
    const client = this.pgService.getPool();

    const foundRead = await client.query(
      'SELECT * from message_reads WHERE message_id=$1 AND user_id=$2',
      [message_id, user_id],
    );

    if (foundRead.rows.length > 0) {
      return null;
    }

    const result = await client.query(
      'INSERT INTO message_reads (message_id, user_id) VALUES ($1, $2) RETURNING *',
      [message_id, user_id],
    );

    return result.rows[0];
  }
}
