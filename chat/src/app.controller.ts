import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  async health() {
    return { message: 'The check pass passed' };
  }
}
