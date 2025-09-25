import { Body, Controller, Post } from '@nestjs/common';
import { CreateTopicUsecase } from '../application/create.topic.usecase';
import { CreateTopicDto } from './dto/create.topic.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly createTopicUsecase: CreateTopicUsecase) {}

  @Post('create')
  async create(@Body() body: CreateTopicDto) {
    return this.createTopicUsecase.execute(body.text, body.user_id);
  }
}
