import { Injectable } from '@nestjs/common';
import {
  HealthCheckService,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { PrismaClient } from '@prisma/client';
import { RedisHealthIndicator } from './redis-health.indicator';
import { ServerHealthIndicator } from './server-health.indicator';

@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly memoryHealth: MemoryHealthIndicator,
    private readonly diskHealth: DiskHealthIndicator,
    private readonly redisHealth: RedisHealthIndicator,
    private readonly serverHealth: ServerHealthIndicator,
    private readonly prisma: PrismaClient,
  ) {}

  async checkDatabase() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }

  async checkMemory() {
    return this.health.check([
      () => this.memoryHealth.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memoryHealth.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }

  async checkDisk() {
    return this.health.check([
      () =>
        this.diskHealth.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9,
        }),
    ]);
  }

  async checkRedis() {
    return this.health.check([() => this.redisHealth.isHealthy('redis')]);
  }

  async checkServer() {
    return this.health.check([() => this.serverHealth.isHealthy('server')]);
  }

  async checkAll() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
      () => this.redisHealth.isHealthy('redis'),
      () => this.serverHealth.isHealthy('server'),
      () => this.memoryHealth.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memoryHealth.checkRSS('memory_rss', 150 * 1024 * 1024),
      () =>
        this.diskHealth.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9,
        }),
    ]);
  }
}
