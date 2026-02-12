import { Injectable } from '@nestjs/common';
import { PostRepositoryPostgres } from '../infrastructure/repos/post.repository';
import { UserRepositoryPostgres } from 'src/auth/infrastructure/repos/user.repository';
import { RMQService } from 'nestjs-rmq';

@Injectable()
export class CreatePostUsecase {
  constructor(
    private readonly postRepository: PostRepositoryPostgres,
    private readonly userRepository: UserRepositoryPostgres,
    private readonly rmqService: RMQService,
  ) {}

  async exec(title: string, post_description: string, user_id: number) {
    const post = await this.postRepository.create(title, post_description, user_id);
    
    // Send notification to user's email
    try {
      const user = await this.userRepository.findById(user_id);
      if (user && user.email) {
        await this.rmqService.notify('notify', {
          type: 'post',
          title: 'Нова публікація створена',
          description: `Ви успішно створили нову публікацію: "${title}"`,
          email: user.email,
        });
      }
    } catch (error) {
      console.error('Failed to send post creation notification:', error);
      // Don't throw error, just log it
    }
    
    return post;
  }
}
