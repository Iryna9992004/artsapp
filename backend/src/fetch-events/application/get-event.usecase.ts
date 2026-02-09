import { Injectable } from '@nestjs/common';
import { EventsRepositoryCLickhouse } from '../infrastructure/repos/events.repository';

@Injectable()
export class GetEventUsecase {
  constructor(
    private readonly clickhouseRepository: EventsRepositoryCLickhouse,
  ) {}

  async exec(limit: number, offset: number, text?: string) {
    return this.clickhouseRepository.getEvents(limit, offset, text);
  }
}
