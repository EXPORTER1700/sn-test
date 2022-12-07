import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisSessionService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  public async get(userId: number): Promise<string | undefined> {
    return await this.cacheManager.get(String(userId));
  }

  public async set(userId: number, refreshToken: string): Promise<void> {
    await this.cacheManager.set(String(userId), refreshToken);
  }

  public async delete(userId: number): Promise<void> {
    await this.cacheManager.del(String(userId));
  }
}
