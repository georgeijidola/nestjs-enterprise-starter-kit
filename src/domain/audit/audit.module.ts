import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuditService } from '../../common/helpers/audit/services/audit.service';
import { AuditController } from './audit.controller';
import { CommonModule } from '../../common/common.module';
import { AuthMiddleware } from '../../common/api/auth/auth.middleware';

@Module({
  imports: [CommonModule],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AuditController);
  }
}
