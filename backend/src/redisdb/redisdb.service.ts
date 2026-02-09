import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisdbService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async setValue(key: string, value: string, ttl: number = 600) {
    await this.redis.set(key, value, 'EX', ttl);
  }

  async getValue(key: string) {
    return await this.redis.get(key);
  }

  async deleteValue(key: string) {
    return await this.redis.del(key);
  }
}
