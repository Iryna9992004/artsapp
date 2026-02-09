import { Controller, Get, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { SearchTopicUsecase } from '../application/searchTopics.usecase';
import { FetchTopicUsecase } from '../application/fetchTopic.usecase';

@Controller('fetch/topic')
export class TopicsController {
  constructor(
    private readonly searchTopicsUsecase: SearchTopicUsecase,
    private readonly fetchTopicUsecase: FetchTopicUsecase,
  ) {}

  @Get('')
  async searchTopics(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('searchText') searchText?: string,
  ) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 10;
      const offsetNum = offset ? parseInt(offset, 10) : 0;
      
      if (isNaN(limitNum) || isNaN(offsetNum) || limitNum < 0 || offsetNum < 0) {
        throw new HttpException('Invalid limit or offset parameters', HttpStatus.BAD_REQUEST);
      }
      
      const resp = await this.searchTopicsUsecase.exec(limitNum, offsetNum, searchText);
      return resp;
    } catch (error) {
      console.error('Error in searchTopics:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('info/:id')
  async getTopic(@Param('id') id: number) {
    const resp = await this.fetchTopicUsecase.exec(id);
    return resp;
  }
}
