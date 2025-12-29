import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { FetchPostsUsecase } from '../application/fetch-posts.usecase';
import { PostsRepositoryCLickhouse } from '../infrastructure/repos/post.repository';
import { ClickhouseModule } from 'src/clickhouse/clickhouse.module';

@Module({
  controllers: [PostsController],
  providers: [FetchPostsUsecase, PostsRepositoryCLickhouse],
  imports: [ClickhouseModule],
})
export class PostsModule {}
