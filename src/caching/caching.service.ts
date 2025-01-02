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
    if (!key) {
      return null;
    }
    this.redisClient.set(key, JSON.stringify(value));
  }
  async get(key: string) {
    // TODO: find a better caching way
    if (!key) {
      return null;
    }
    const retrieved = await this.redisClient.get(key);
    let result;
    try {
      result = JSON.parse(retrieved);
    } catch {
      result = retrieved;
    }
    return result;
  }

  public async deleteTestCache() {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    await this.redisClient.flushAll();
  }
}
