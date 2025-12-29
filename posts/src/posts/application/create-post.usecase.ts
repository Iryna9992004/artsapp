import { Injectable } from '@nestjs/common';
import { PostRepositoryPostgres } from '../infrastructure/repos/post.repository';

@Injectable()
export class CreatePostUsecase {
  constructor(private readonly postRepository: PostRepositoryPostgres) {}

  async exec(title: string, post_description: string, user_id: number) {
    return this.postRepository.create(title, post_description, user_id);
  }
}
