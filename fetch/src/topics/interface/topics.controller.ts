import { Controller, Get, Query } from '@nestjs/common';
import { SearchTopicUsecase } from '../application/searchTopics.usecase';

@Controller('topic')
export class TopicsController {
  constructor(private readonly searchTopicsUsecase: SearchTopicUsecase) {}

  @Get('')
  async searchTopics(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('searchText') searchText: string,
  ) {
    const resp = await this.searchTopicsUsecase.exec(limit, offset, searchText);
    return resp;
  }
}
