import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { RedisModule, InjectRedis } from '@nestjs-modules/ioredis';
import type Redis from 'ioredis';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL ?? 'redis://localhost:6379',
    }),
  ],
  exports: [RedisModule],
})
export class AppRedisModule implements OnModuleInit {
  private readonly logger = new Logger(AppRedisModule.name);
  private isDisconnected = false;

  constructor(@InjectRedis() private readonly redis: Redis) {}

  onModuleInit(): void {
    this.redis.on('error', (err: Error) => {
      if (!this.isDisconnected) {
        this.isDisconnected = true;
        this.logger.error(`Redis connection error: ${err.message}`);
      }
    });

    this.redis.on('connect', () => {
      if (this.isDisconnected) {
        this.isDisconnected = false;
        this.logger.log('Redis reconnected');
      }
    });
  }
}
