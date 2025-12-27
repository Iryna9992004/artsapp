import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchTopicUsecase } from '../application/searchTopics.usecase';
import { FetchTopicUsecase } from '../application/fetchTopic.usecase';

@Controller('topic')
export class TopicsController {
  constructor(
    private readonly searchTopicsUsecase: SearchTopicUsecase,
    private readonly fetchTopicUsecase: FetchTopicUsecase,
  ) {}

  @Get('')
  async searchTopics(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('searchText') searchText: string,
  ) {
    const resp = await this.searchTopicsUsecase.exec(limit, offset, searchText);
    return resp;
  }

  @Get('info/:id')
  async getTopic(@Param('id') id: number) {
    const resp = await this.fetchTopicUsecase.exec(id);
    return resp;
  }
}
