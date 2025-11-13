import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PrismaService } from '../../loaders/database/prisma.loader';
import { AppConfiguration } from '../../config/app.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [AppConfiguration],
      useFactory: (config: AppConfiguration) => ({
        secret: config.jwtSecret,
        signOptions: { expiresIn: `${config.jwtSecretExpire}s` },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
