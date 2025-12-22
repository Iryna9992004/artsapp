import { Injectable } from '@nestjs/common';
import { ClickhouseService } from 'src/clickhouse/clickhouse.service';
import { config } from 'src/shared/config/env';
import { Topic } from 'src/topics/domain/entities/topic.entity';
import { TopicRepository } from 'src/topics/domain/repos/topic.repository';

@Injectable()
export class TopicRepositoryClickhouse implements TopicRepository {
  constructor(private readonly clickhouseService: ClickhouseService) {}

  async search(): Promise<Topic[]> {
    try {
      const rows = await this.clickhouseService.getConfig().query({
        query: `SELECT * FROM ${config.db.name}.topics`,
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
