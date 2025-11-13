import { BadRequestException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export interface ParsedMultipartData<T> {
  data: T;
  files: Array<{
    buffer: Buffer;
    mimetype: string;
    filename: string;
    fieldname: string;
    size: number;
  }>;
}

export class MultipartUtil {
  static async parseMultipartRequest<T>(
    request: FastifyRequest,
    dataFieldName: string = 'productData',
  ): Promise<ParsedMultipartData<T>> {
    const parts = request.parts();
    let jsonData: T | null = null;
    const files: Array<{
      buffer: Buffer;
      mimetype: string;
      filename: string;
      fieldname: string;
      size: number;
    }> = [];

    for await (const part of parts) {
      if (part.type === 'field' && part.fieldname === dataFieldName) {
        try {
          jsonData = JSON.parse(part.value as string);
        } catch {
          throw new BadRequestException(
            `Invalid JSON in ${dataFieldName} field`,
          );
        }
      } else if (part.type === 'file') {
        const buffer = await part.toBuffer();
        files.push({
          buffer,
          mimetype: part.mimetype,
          filename: part.filename,
          fieldname: part.fieldname,
          size: buffer.length,
        });
      }
    }

    if (!jsonData) {
      throw new BadRequestException(
        `Missing ${dataFieldName} field in multipart request`,
      );
    }

    return { data: jsonData, files };
  }
}
