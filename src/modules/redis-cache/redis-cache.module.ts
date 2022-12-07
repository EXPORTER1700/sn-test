import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { CacheStore } from '@nestjs/common/cache/interfaces/cache-manager.interface';
import { RedisCacheService } from '@app/modules/redis-cache/redis-cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_CACHE_PORT'),
          },
          ttl: 60 * 60 * 24 * 7,
        });
        return {
          store: (() => store) as unknown as CacheStore,
        };
      },
      isGlobal: true,
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService, CacheModule],
})
export class RedisCacheModule {}
