import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisdbService } from 'src/redisdb/redisdb.service';

@Injectable()
export class LogoutUsecase {
  constructor(private readonly redisService: RedisdbService) {}

  async execute(userAgent: string) {
    if (!userAgent) {
      throw new UnauthorizedException('Session expired');
    }
    await this.redisService.deleteValue(userAgent);
    return { message: 'User logged out successfuly' };
  }
}
