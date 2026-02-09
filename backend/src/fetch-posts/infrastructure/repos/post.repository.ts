import { Injectable } from '@nestjs/common';
import { ClickhouseService } from 'src/clickhouse/clickhouse.service';
import { PostEntity } from 'src/fetch-posts/domain/entities/post.entity';
import { PostRepository } from 'src/fetch-posts/domain/repos/post.repository';
import { config } from 'src/shared/config/env';

@Injectable()
export class PostsRepositoryCLickhouse implements PostRepository {
  constructor(private readonly clickhouseService: ClickhouseService) {}

  async getPosts(
    limit: number,
    offset: number,
    text?: string,
  ): Promise<PostEntity[]> {
    if (text && text.length > 0) {
      const rows = await this.clickhouseService.getConfig().query({
        query: `SELECT t.*,
              u.full_name AS author_name
              FROM ${config.db.name}.posts t
              LEFT JOIN ${config.db.name}.users u ON u.id = t.user_id
              WHERE t.title LIKE '${text}%' OR t.post_description LIKE '${text}%'
              ORDER BY t.id 
              LIMIT ${limit} 
              OFFSET ${offset}`,
        format: 'JSONEachRow',
      });

      const events = await rows.json<PostEntity>();
      return events;
    }

    const rows = await this.clickhouseService.getConfig().query({
      query: `SELECT t.*,
              u.full_name AS author_name
              FROM ${config.db.name}.posts t
              LEFT JOIN ${config.db.name}.users u ON u.id = t.user_id
              ORDER BY t.id 
              LIMIT ${limit} 
              OFFSET ${offset}`,
      format: 'JSONEachRow',
    });

    const events = await rows.json<PostEntity>();
    return events;
  }
}
