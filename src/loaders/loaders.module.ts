import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { AppConfiguration } from '../config/app.config';
import { PrismaService } from './database/prisma.loader';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [PrismaService, AppConfiguration],
  exports: [PrismaService, AppConfiguration],
})
export class LoadersModule {}
