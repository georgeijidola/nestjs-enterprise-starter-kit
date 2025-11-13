import { Injectable, Inject } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisHealthIndicator {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Test Redis connection by setting and getting a test key
      const testKey = 'health-check-test';
      const testValue = 'health-check-value';
      const testTtl = 1000; // 1 second

      await this.cacheManager.set(testKey, testValue, testTtl);
      const retrievedValue = await this.cacheManager.get(testKey);

      if (retrievedValue !== testValue) {
        throw new Error('Redis value mismatch');
      }

      // Clean up test key
      await this.cacheManager.del(testKey);

      return {
        [key]: {
          status: 'up',
          message: 'Redis is healthy',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        [key]: {
          status: 'down',
          message: 'Redis is unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
