import { Controller, Get } from '@nestjs/common';
import { SearchTopicUsecase } from '../infrastructure/services/searchTopics.usecase';

@Controller('topic')
export class TopicsController {
  constructor(private readonly searchTopicsUsecase: SearchTopicUsecase) {}

  @Get('')
  async searchTopics() {
    const resp = await this.searchTopicsUsecase.exec();
    return resp;
  }
}
