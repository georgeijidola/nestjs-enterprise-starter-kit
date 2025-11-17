import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { PrismaService } from '../../loaders/database/prisma.loader';
import { CommonModule } from '../../common/common.module';
import { AuthMiddleware } from '../../common/api/auth/auth.middleware';

@Module({
  imports: [CommonModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UsersController);
  }
}
