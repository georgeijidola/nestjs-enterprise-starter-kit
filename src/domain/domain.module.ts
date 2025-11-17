import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ApiKeyModule } from './api-key/api-key.module';

@Module({
  imports: [AuthModule, UsersModule, ApiKeyModule],
  exports: [AuthModule, UsersModule, ApiKeyModule],
})
export class DomainModule {}
