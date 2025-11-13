import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FileUploadResponseDto {
  @ApiProperty({
    description: 'Name of the uploaded file',
    example: 'photo.jpg',
  })
  fileName: string;

  @ApiProperty({
    description: 'Full path to the file in the bucket',
    example: 'uploads/images/photo.jpg',
  })
  filePath: string;

  @ApiPropertyOptional({
    description: 'Public URL if the file was made public',
    example:
      'https://storage.googleapis.com/my-bucket/uploads/images/photo.jpg',
  })
  publicUrl?: string;

  @ApiPropertyOptional({
    description: 'File size in bytes',
    example: 1024000,
  })
  size?: number;

  @ApiPropertyOptional({
    description: 'Content type of the file',
    example: 'image/jpeg',
  })
  contentType?: string;
}
