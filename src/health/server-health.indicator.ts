import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { AppConfiguration } from '../config/app.config';

@Injectable()
export class ServerHealthIndicator extends HealthIndicator {
  constructor(private readonly appConfig: AppConfiguration) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const uptime = process.uptime();
      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      const serverInfo = {
        uptime: `${Math.floor(uptime)}s`,
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system,
        },
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        port: this.appConfig.port,
        serverIp: this.appConfig.serverIp,
        timestamp: new Date().toISOString(),
      };

      return this.getStatus(key, true, serverInfo);
    } catch (error) {
      const result = this.getStatus(key, false, {
        message: 'Server health check failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      });

      throw new HealthCheckError('Server health check failed', result);
    }
  }
}
