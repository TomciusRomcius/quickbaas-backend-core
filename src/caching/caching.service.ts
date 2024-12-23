import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { Logger } from '@nestjs/common';

@Injectable()
export class CachingService {
  private redisClient: RedisClientType;

  async onModuleInit() {
    this.redisClient = createClient({ url: 'redis://redis:6379' });
    this.redisClient.on('error', (err) => Logger.error(err));
    await this.redisClient.connect();
  }
  async set(key: string, value: any) {
    this.redisClient.set(key, value);
  }
  async get(key: string) {
    const retrieved = await this.redisClient.get(key);
    return JSON.parse(retrieved);
  }
}
