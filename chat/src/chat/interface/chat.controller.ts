import { Body, Controller, Post } from '@nestjs/common';
import { CreateTopicUsecase } from '../application/topics/create.topic.usecase';
import { CreateTopicDto } from './dto/create.topic.dto';
import { ReadTopicDto } from './dto/read.topic.dto';
import { ReadTopicUsecase } from '../application/topics/read.topic.usecase';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly createTopicUsecase: CreateTopicUsecase,
    private readonly readtopicUsecase: ReadTopicUsecase,
  ) {}

  @Post('create')
  async create(@Body() body: CreateTopicDto) {
    return this.createTopicUsecase.execute(body.text, body.user_id);
  }

  @Post('read')
  async read(@Body() body: ReadTopicDto) {
    return this.readtopicUsecase.execute(body.user_id, body.topic_id);
  }
}
