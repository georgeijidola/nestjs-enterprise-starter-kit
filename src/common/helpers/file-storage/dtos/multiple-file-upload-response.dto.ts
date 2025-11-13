import { ApiProperty } from '@nestjs/swagger';
import { FileUploadResponseDto } from './file-upload-response.dto';

export class FailedFileUploadDto {
  @ApiProperty({
    description: 'Name of the file that failed to upload',
    example: 'large-file.jpg',
  })
  fileName: string;

  @ApiProperty({
    description: 'Error message describing why the upload failed',
    example: 'File size exceeds maximum limit',
  })
  error: string;
}

export class MultipleFileUploadResponseDto {
  @ApiProperty({
    description: 'Array of successfully uploaded files',
    type: [FileUploadResponseDto],
  })
  successful: FileUploadResponseDto[];

  @ApiProperty({
    description: 'Array of files that failed to upload',
    type: [FailedFileUploadDto],
  })
  failed: FailedFileUploadDto[];

  @ApiProperty({
    description: 'Total number of files successfully uploaded',
    example: 3,
  })
  totalUploaded: number;

  @ApiProperty({
    description: 'Total number of files that failed to upload',
    example: 1,
  })
  totalFailed: number;
}
