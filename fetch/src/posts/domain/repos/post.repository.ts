import { PostEntity } from '../entities/post.entity';

export interface PostRepository {
  getPosts(limit: number, offset: number): Promise<PostEntity[]>;
}
