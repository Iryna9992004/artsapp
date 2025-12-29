import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostUsecase } from '../application/create-post.usecase';
import { CreatePostDto } from './dtos/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly createPostUsecase: CreatePostUsecase) {}

  @Post('create')
  async create(@Body() body: CreatePostDto) {
    const { title, post_description, user_id } = body;
    return this.createPostUsecase.exec(title, post_description, user_id);
  }
}
