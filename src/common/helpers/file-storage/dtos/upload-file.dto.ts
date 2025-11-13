import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload to Google Cloud Storage',
  })
  file: any;

  @ApiPropertyOptional({
    description:
      'Destination path in the bucket (e.g., "uploads/images/photo.jpg")',
    example: 'uploads/documents/file.pdf',
  })
  @IsString()
  @IsOptional()
  destination?: string;

  @ApiPropertyOptional({
    description: 'Make the file publicly accessible',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  makePublic?: boolean;

  @ApiPropertyOptional({
    description: 'Custom metadata as key-value pairs',
    example: { category: 'documents', uploadedBy: 'admin' },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, string>;
}
