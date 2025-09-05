import { Module } from '@nestjs/common';
import { RedisdbService } from './redisdb.service';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  providers: [RedisdbService],
  imports: [
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: '127.0.0.1',
        port: 6379,
        db: 0,
      },
    }),
  ],
  exports: [RedisdbService],
})
export class RedisdbModule {}
