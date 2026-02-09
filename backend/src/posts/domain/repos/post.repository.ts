import { PostEntity } from '../entities/post.entity';

export interface PostRepository {
  create(
    title: string,
    post_description: string,
    user_id: number,
  ): Promise<PostEntity[]>;
}
