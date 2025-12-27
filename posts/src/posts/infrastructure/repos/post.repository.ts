import { Injectable } from '@nestjs/common';
import { PostRepository } from 'src/posts/domain/repos/post.repository';

@Injectable()
export class PostRepositoryPostgres implements PostRepository {}
