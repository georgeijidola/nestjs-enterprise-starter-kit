import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaClient } from '@prisma/client';
import { CacheService } from './helpers/cache/cache.service';
import { EmailService } from './helpers/email/email.service';
import { HealthService } from '../health/health.service';
import { PrismaService } from '../loaders/database/prisma.loader';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ApiKeyService } from '../domain/api-key/services/api-key.service';
import { AppConfiguration } from '../config/app.config';
import { AuditService } from './helpers/audit/services/audit.service';

import { AuthenticationUtilityService } from './helpers/authentication-utility/authentication-utility.service';
import { AuthMiddleware } from './api/auth/auth.middleware';
import { RedisHealthIndicator } from '../health/redis-health.indicator';
import { ServerHealthIndicator } from '../health/server-health.indicator';

@Module({
  imports: [TerminusModule],
  providers: [
    PrismaClient,
    RedisHealthIndicator,
    ServerHealthIndicator,
    AppConfiguration,
    AuthenticationUtilityService,
    AuthMiddleware,
    CacheService,
    EmailService,
    HealthService,
    PrismaService,
    ApiKeyGuard,
    ApiKeyService,
    AuditService,
  ],
  exports: [
    PrismaClient,
    AppConfiguration,
    AuthenticationUtilityService,
    AuthMiddleware,
    CacheService,
    EmailService,
    HealthService,
    PrismaService,
    ApiKeyGuard,
    ApiKeyService,
    AuditService,
  ],
})
export class CommonModule {}
