import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  public async get(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  public async set(key: string, value: any): Promise<void> {
    return await this.cacheManager.set(key, value);
  }

  public async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
