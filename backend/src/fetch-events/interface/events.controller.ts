import { Controller, Get, Query } from '@nestjs/common';
import { GetEventUsecase } from '../application/get-event.usecase';

@Controller('events')
export class EventsController {
  constructor(private readonly getEventUsecase: GetEventUsecase) {}

  @Get('')
  async get(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('searchText') searchText: string,
  ) {
    return this.getEventUsecase.exec(limit, offset, searchText);
  }
}
