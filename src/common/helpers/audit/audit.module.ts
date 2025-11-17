import {
  Module,
  NestModule,
  MiddlewareConsumer,
  forwardRef,
} from '@nestjs/common';
import { AuditService } from './services/audit.service';
import { AuditController } from './audit.controller';
import { CommonModule } from '../../common.module';
import { AuthMiddleware } from '../../api/auth/auth.middleware';

@Module({
  imports: [forwardRef(() => CommonModule)],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AuditController);
  }
}
