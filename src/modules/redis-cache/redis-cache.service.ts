import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheProfileType } from '@app/modules/profile/types/cacheProfile.type';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  public async get(username: string): Promise<CacheProfileType | undefined> {
    return await this.cacheManager.get(username);
  }

  public async set(cacheProfile: CacheProfileType): Promise<void> {
    await this.cacheManager.set(cacheProfile.profile.username, cacheProfile);
  }

  public async delete(username: string) {
    await this.cacheManager.del(username);
  }
}
