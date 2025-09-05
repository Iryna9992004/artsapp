import { Injectable } from '@nestjs/common';
import { RedisdbService } from 'src/redisdb/redisdb.service';

@Injectable()
export class LogoutUsecase {
  constructor(private readonly redisService: RedisdbService) {}

  async execute(ip: string) {
    console.log('-=-=-=-=', ip);
    await this.redisService.deleteValue(ip);
    return { message: 'User logged out successfuly' };
  }
}
