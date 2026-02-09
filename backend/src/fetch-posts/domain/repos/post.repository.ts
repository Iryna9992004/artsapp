import { PostEntity } from '../entities/post.entity';

export interface PostRepository {
  getPosts(limit: number, offset: number, text?: string): Promise<PostEntity[]>;
}
