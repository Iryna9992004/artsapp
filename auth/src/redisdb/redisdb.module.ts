import { Module } from '@nestjs/common';
import { RedisdbService } from './redisdb.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import config from 'src/shared/config';
@Module({
  providers: [RedisdbService],
  imports: [
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: config.redis.host || '127.0.0.1',
        port: config.redis.port || 6379,
        name: 'redis',
        password: config.redis.password || '1111',
        db: 0,
      },
    }),
  ],
  exports: [RedisdbService],
})
export class RedisdbModule {}
