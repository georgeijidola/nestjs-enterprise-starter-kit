import { Module } from '@nestjs/common';
import { CacheService } from './helpers/cache/cache.service';
import { EmailService } from './helpers/email/email.service';
import { HealthService } from '../health/health.service';
import { PrismaService } from '../loaders/database/prisma.loader';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ApiKeyService } from 'src/domain/api-key/services/api-key.service';

@Module({
  providers: [
    CacheService,
    EmailService,
    HealthService,
    PrismaService,
    ApiKeyGuard,
    ApiKeyService,
  ],
  exports: [
    CacheService,
    EmailService,
    HealthService,
    PrismaService,
    ApiKeyGuard,
    ApiKeyService,
  ],
})
export class CommonModule {}
