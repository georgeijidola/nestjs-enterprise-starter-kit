import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ApiKeyModule } from './api-key/api-key.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [AuthModule, UsersModule, ApiKeyModule, AuditModule],
  exports: [AuthModule, UsersModule, ApiKeyModule, AuditModule],
})
export class DomainModule {}
