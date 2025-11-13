import { UnprocessableEntityException } from '@nestjs/common';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface ValidatedFile {
  buffer: Buffer;
  mimetype: string;
  filename: string;
  size: number;
}

export class FileValidationUtil {
  static validateImageFile(file: ValidatedFile): void {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new UnprocessableEntityException(
        `Invalid file type: ${file.mimetype}. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new UnprocessableEntityException(
        `File size exceeds limit: ${file.size} bytes. Maximum allowed: ${MAX_FILE_SIZE} bytes`,
      );
    }
  }

  static validateImageFiles(files: ValidatedFile[]): void {
    if (!files || files.length === 0) {
      throw new UnprocessableEntityException(
        'At least one image file is required',
      );
    }

    files.forEach((file, index) => {
      try {
        this.validateImageFile(file);
      } catch (error) {
        throw new UnprocessableEntityException(
          `File at index ${index} (${file.filename}): ${error.message}`,
        );
      }
    });
  }

  static getFileExtension(mimetype: string): string {
    const mimeMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    return mimeMap[mimetype] || 'jpg';
  }
}
