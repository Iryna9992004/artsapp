import { Module } from '@nestjs/common';
import { PostsController } from './interface/post.controller';
import { PgModule } from 'src/pg/pg.module';
import { PostRepositoryPostgres } from './infrastructure/repos/post.repository';
import { CreatePostUsecase } from './application/create-post.usecase';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PostsController],
  imports: [PgModule, AuthModule],
  providers: [PostRepositoryPostgres, CreatePostUsecase],
})
export class PostModule {}
