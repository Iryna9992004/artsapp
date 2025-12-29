import { Module } from '@nestjs/common';
import { PgModule } from './pg/pg.module';
import { PostModule } from './posts/post.module';

@Module({
  imports: [PgModule, PostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
