import { PostEntity } from '../entities/post.entity';

export interface PostRepository {
  create(): Promise<PostEntity[]>;
}
