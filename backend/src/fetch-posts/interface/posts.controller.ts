import { Controller, Get, Query } from '@nestjs/common';
import { FetchPostsUsecase } from '../application/fetch-posts.usecase';

@Controller('posts')
export class PostsController {
  constructor(private readonly fetchPostsUsecase: FetchPostsUsecase) {}

  @Get('')
  async fetch(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('searchText') searchText: string,
  ) {
    return this.fetchPostsUsecase.exec(limit, offset, searchText);
  }
}
