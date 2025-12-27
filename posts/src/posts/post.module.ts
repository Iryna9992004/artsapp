import { Module } from '@nestjs/common';
import { PostsController } from './interface/post.controller';
import { PgModule } from 'src/pg/pg.module';
import { PostRepositoryPostgres } from './infrastructure/repos/post.repository';

@Module({
  controllers: [PostsController],
  imports: [PgModule],
  providers: [PostRepositoryPostgres],
})
export class PostModule {}
