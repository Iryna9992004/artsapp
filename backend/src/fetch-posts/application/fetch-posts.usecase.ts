import { Injectable } from '@nestjs/common';
import { PostsRepositoryCLickhouse } from '../infrastructure/repos/post.repository';

@Injectable()
export class FetchPostsUsecase {
  constructor(private readonly postRepository: PostsRepositoryCLickhouse) {}

  async exec(limit: number, offset: number, text?: string) {
    return this.postRepository.getPosts(limit, offset, text);
  }
}
