import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ApiKeyService } from './services/api-key.service';
import { ApiKeyController } from './api-key.controller';
import { CommonModule } from '../../common/common.module';
import { AuthMiddleware } from '../../common/api/auth/auth.middleware';

@Module({
  imports: [CommonModule],
  controllers: [ApiKeyController],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ApiKeyController);
  }
}
