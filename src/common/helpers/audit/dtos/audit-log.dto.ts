import {
  IsString,
  IsOptional,
  IsObject,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { AuditAction } from '@prisma/client';

export class CreateAuditLogDto {
  @IsOptional()
  @IsString()
  userId: string | null;

  @IsString()
  @IsNotEmpty()
  userEmail: string;

  @IsEnum(AuditAction)
  @IsNotEmpty()
  action: AuditAction;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  method: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}

export class AuditLogFiltersDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  userEmail?: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  createdAt?: Date;
}
