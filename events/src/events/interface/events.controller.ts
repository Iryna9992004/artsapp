import { Body, Controller, Post } from '@nestjs/common';
import { CreateEventsecase } from '../application/create-event.usecase';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly createEventUsecase: CreateEventsecase) {}

  @Post('')
  async create(@Body() body: CreateEventDto) {
    const { title, event_description, user_id } = body;
    return this.createEventUsecase.exec(title, event_description, user_id);
  }
}
