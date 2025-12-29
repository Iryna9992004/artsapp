import { Injectable } from '@nestjs/common';
import { PgService } from 'src/pg/pg.service';
import { PostEntity } from 'src/posts/domain/entities/post.entity';
import { PostRepository } from 'src/posts/domain/repos/post.repository';

@Injectable()
export class PostRepositoryPostgres implements PostRepository {
  constructor(private readonly pgService: PgService) {}

  async create(
    title: string,
    post_description: string,
    user_id: number,
  ): Promise<PostEntity[]> {
    const client = this.pgService.getPool();

    const result = await client.query(
      'INSERT INTO posts (title, post_description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, post_description, user_id],
    );

    return result.rows[0] as never;
  }
}
