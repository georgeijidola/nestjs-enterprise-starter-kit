import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { LoadersModule } from './loaders/loaders.module';
import { CommonModule } from './common/common.module';
import { DomainModule } from './domain/domain.module';
import { QueuesModule } from './queues/queues.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 300000,
    }),
    LoadersModule,
    CommonModule,
    DomainModule,
    QueuesModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
