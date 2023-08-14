import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string) {
    return await this.cache.get(key);
  }

  async set(key: string, value: any, ttl = 5) {
    await this.cache.set(key, value, ttl);
  }

  async reset() {
    await this.cache.reset();
  }

  async delete(key: string) {
    await this.cache.del(key);
  }
}
