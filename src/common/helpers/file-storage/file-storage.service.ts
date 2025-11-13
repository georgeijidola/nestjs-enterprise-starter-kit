import { Injectable, Logger } from '@nestjs/common';
import { Storage, Bucket, File } from '@google-cloud/storage';
import { AppConfiguration } from 'src/config/app.config';
import { Readable } from 'stream';

export interface UploadOptions {
  destination: string;
  contentType?: string;
  metadata?: Record<string, string>;
  makePublic?: boolean;
}

export interface DownloadOptions {
  start?: number;
  end?: number;
}

export interface FileUploadResult {
  fileName: string;
  filePath: string;
  publicUrl?: string;
  size?: number;
  contentType?: string;
}

export interface MultipleFileUploadResult {
  successful: FileUploadResult[];
  failed: { fileName: string; error: string }[];
  totalUploaded: number;
  totalFailed: number;
}

@Injectable()
export class FileStorageService {
  private readonly storage: Storage;
  private readonly bucket: Bucket;
  private readonly logger = new Logger(FileStorageService.name);

  constructor(private readonly config: AppConfiguration) {
    const storageOptions: {
      projectId: string;
      keyFilename?: string;
      credentials?: object;
    } = {
      projectId: this.config.gcsProjectId,
    };

    if (this.config.gcsKeyFilePath) {
      storageOptions.keyFilename = this.config.gcsKeyFilePath;
      this.logger.log('Initializing GCS with key file path');
    } else if (this.config.gcsCredentialsParsed) {
      storageOptions.credentials = this.config.gcsCredentialsParsed;
      this.logger.log('Initializing GCS with JSON credentials');
    } else {
      this.logger.warn(
        'No GCS credentials provided. Using default credentials from environment.',
      );
    }

    this.storage = new Storage(storageOptions);
    this.bucket = this.storage.bucket(this.config.gcsBucketName);

    this.logger.log(
      `FileStorageService initialized with bucket: ${this.config.gcsBucketName}`,
    );
  }

  /**
   * Upload a file to Google Cloud Storage
   * @param fileBuffer - The file content as a Buffer
   * @param options - Upload options including destination path and metadata
   * @returns Promise<FileUploadResult> - Information about the uploaded file
   */
  async uploadFile(
    fileBuffer: Buffer,
    options: UploadOptions,
  ): Promise<FileUploadResult> {
    const { destination, contentType, metadata, makePublic = false } = options;

    try {
      this.logger.log(`Uploading file to: ${destination}`);

      const file: File = this.bucket.file(destination);

      await new Promise<void>((resolve, reject) => {
        const stream = file.createWriteStream({
          metadata: {
            contentType: contentType || 'application/octet-stream',
            metadata: metadata || {},
          },
          resumable: false,
        });

        stream.on('error', (error) => {
          this.logger.error(`Upload error for ${destination}:`, error);
          reject(error);
        });

        stream.on('finish', () => {
          this.logger.log(`File uploaded successfully: ${destination}`);
          resolve();
        });

        stream.end(fileBuffer);
      });

      let isPublic = false;
      if (makePublic) {
        try {
          await file.makePublic();
          this.logger.log(`File made public: ${destination}`);
          isPublic = true;
        } catch (error) {
          if (
            error.code === 400 &&
            error.message?.includes('uniform bucket-level access')
          ) {
            this.logger.warn(
              `Cannot make file public: bucket has uniform bucket-level access enabled. ` +
                `Use signed URLs for temporary access or configure bucket-level permissions.`,
            );
            isPublic = false;
          } else {
            throw error;
          }
        }
      }

      const [fileMetadata] = await file.getMetadata();

      const result: FileUploadResult = {
        fileName: destination.split('/').pop() || destination,
        filePath: destination,
        size: fileMetadata.size
          ? typeof fileMetadata.size === 'string'
            ? parseInt(fileMetadata.size, 10)
            : fileMetadata.size
          : undefined,
        contentType: fileMetadata.contentType,
      };

      if (isPublic) {
        result.publicUrl = `https://storage.googleapis.com/${this.config.gcsBucketName}/${destination}`;
      }

      this.logger.log(`Upload completed: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to upload file to ${destination}:`, error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  /**
   * Upload multiple files to Google Cloud Storage (atomic operation)
   * @param files - Array of file data with buffers and options
   * @returns Promise<MultipleFileUploadResult> - Results of all uploads
   * @throws Error if any upload fails (after cleaning up successful uploads)
   */
  async uploadMultipleFiles(
    files: Array<{ buffer: Buffer; options: UploadOptions }>,
  ): Promise<MultipleFileUploadResult> {
    this.logger.log(`Uploading ${files.length} files`);

    const results = await Promise.allSettled(
      files.map(({ buffer, options }) => this.uploadFile(buffer, options)),
    );

    const successful: FileUploadResult[] = [];
    const failed: { fileName: string; error: string }[] = [];

    results.forEach((result, index) => {
      const fileName =
        files[index].options.destination.split('/').pop() || `file-${index}`;

      if (result.status === 'fulfilled') {
        successful.push(result.value);
      } else {
        failed.push({
          fileName,
          error: result.reason?.message || 'Unknown error',
        });
      }
    });

    if (failed.length > 0) {
      this.logger.error(
        `${failed.length} uploads failed, cleaning up ${successful.length} successful uploads`,
      );

      await Promise.allSettled(
        successful.map((file) => this.deleteFile(file.filePath)),
      );

      throw new Error(
        `Upload failed for ${failed.length} files: ${failed.map((f) => f.fileName).join(', ')}`,
      );
    }

    this.logger.log(`All ${successful.length} files uploaded successfully`);

    return {
      successful,
      failed: [],
      totalUploaded: successful.length,
      totalFailed: 0,
    };
  }

  /**
   * Upload a file from a stream to Google Cloud Storage
   * @param stream - Readable stream containing file data
   * @param options - Upload options including destination path and metadata
   * @returns Promise<FileUploadResult> - Information about the uploaded file
   */
  async uploadFileFromStream(
    stream: Readable,
    options: UploadOptions,
  ): Promise<FileUploadResult> {
    const { destination, contentType, metadata, makePublic = false } = options;

    try {
      this.logger.log(`Uploading file from stream to: ${destination}`);

      const file: File = this.bucket.file(destination);

      await new Promise<void>((resolve, reject) => {
        const writeStream = file.createWriteStream({
          metadata: {
            contentType: contentType || 'application/octet-stream',
            metadata: metadata || {},
          },
          resumable: false,
        });

        writeStream.on('error', (error) => {
          this.logger.error(`Upload error for ${destination}:`, error);
          reject(error);
        });

        writeStream.on('finish', () => {
          this.logger.log(
            `File uploaded successfully from stream: ${destination}`,
          );
          resolve();
        });

        stream.pipe(writeStream);
      });

      let isPublic = false;
      if (makePublic) {
        try {
          await file.makePublic();
          this.logger.log(`File made public: ${destination}`);
          isPublic = true;
        } catch (error) {
          if (
            error.code === 400 &&
            error.message?.includes('uniform bucket-level access')
          ) {
            this.logger.warn(
              `Cannot make file public: bucket has uniform bucket-level access enabled. ` +
                `Use signed URLs for temporary access or configure bucket-level permissions.`,
            );
            isPublic = false;
          } else {
            throw error;
          }
        }
      }

      const [fileMetadata] = await file.getMetadata();

      const result: FileUploadResult = {
        fileName: destination.split('/').pop() || destination,
        filePath: destination,
        size: fileMetadata.size
          ? typeof fileMetadata.size === 'string'
            ? parseInt(fileMetadata.size, 10)
            : fileMetadata.size
          : undefined,
        contentType: fileMetadata.contentType,
      };

      if (isPublic) {
        result.publicUrl = `https://storage.googleapis.com/${this.config.gcsBucketName}/${destination}`;
      }

      this.logger.log(`Stream upload completed: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to upload file from stream to ${destination}:`,
        error,
      );
      throw new Error(`File stream upload failed: ${error.message}`);
    }
  }

  /**
   * Retrieve a file from Google Cloud Storage
   * @param filePath - The path to the file in the bucket
   * @param options - Download options (optional byte range)
   * @returns Promise<Buffer> - The file content as a Buffer
   */
  async getFile(filePath: string, options?: DownloadOptions): Promise<Buffer> {
    try {
      this.logger.log(`Retrieving file: ${filePath}`);

      const file: File = this.bucket.file(filePath);

      const [exists] = await file.exists();
      if (!exists) {
        this.logger.warn(`File not found: ${filePath}`);
        throw new Error(`File not found: ${filePath}`);
      }

      const downloadOptions: {
        start?: number;
        end?: number;
      } = {};
      if (options?.start !== undefined || options?.end !== undefined) {
        downloadOptions.start = options.start;
        downloadOptions.end = options.end;
      }

      const [fileBuffer] = await file.download(downloadOptions);

      this.logger.log(
        `File retrieved successfully: ${filePath} (${fileBuffer.length} bytes)`,
      );
      return fileBuffer;
    } catch (error) {
      this.logger.error(`Failed to retrieve file ${filePath}:`, error);
      throw new Error(`File retrieval failed: ${error.message}`);
    }
  }

  /**
   * Get a readable stream for a file from Google Cloud Storage
   * @param filePath - The path to the file in the bucket
   * @returns Readable - A readable stream of the file content
   */
  getFileStream(filePath: string): Readable {
    try {
      this.logger.log(`Creating read stream for file: ${filePath}`);

      const file: File = this.bucket.file(filePath);
      const readStream = file.createReadStream();

      readStream.on('error', (error) => {
        this.logger.error(`Stream error for ${filePath}:`, error);
      });

      return readStream;
    } catch (error) {
      this.logger.error(`Failed to create read stream for ${filePath}:`, error);
      throw new Error(`Failed to create file stream: ${error.message}`);
    }
  }

  /**
   * Delete a file from Google Cloud Storage
   * @param filePath - The path to the file to delete
   * @returns Promise<void>
   * @throws NotFoundException if file doesn't exist
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      this.logger.log(`Deleting file: ${filePath}`);

      const file: File = this.bucket.file(filePath);

      const [exists] = await file.exists();
      if (!exists) {
        this.logger.warn(`File not found for deletion: ${filePath}`);
        const error: any = new Error(`File not found: ${filePath}`);
        error.code = 'NOT_FOUND';
        throw error;
      }

      await file.delete();

      this.logger.log(`File deleted successfully: ${filePath}`);
    } catch (error) {
      if (error.code === 'NOT_FOUND') {
        throw error;
      }
      this.logger.error(`Failed to delete file ${filePath}:`, error);
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }

  /**
   * Delete multiple files from Google Cloud Storage
   * @param filePaths - Array of file paths to delete
   * @returns Promise<{ deleted: string[]; failed: string[] }> - Results of the deletion operation
   */
  async deleteFiles(
    filePaths: string[],
  ): Promise<{ deleted: string[]; failed: string[] }> {
    this.logger.log(`Deleting ${filePaths.length} files`);

    const deleted: string[] = [];
    const failed: string[] = [];

    await Promise.allSettled(
      filePaths.map(async (filePath) => {
        try {
          await this.deleteFile(filePath);
          deleted.push(filePath);
        } catch (error) {
          this.logger.error(`Failed to delete ${filePath}:`, error);
          failed.push(filePath);
        }
      }),
    );

    this.logger.log(
      `Deletion complete: ${deleted.length} deleted, ${failed.length} failed`,
    );
    return { deleted, failed };
  }

  /**
   * Check if a file exists in Google Cloud Storage
   * @param filePath - The path to check
   * @returns Promise<boolean> - True if file exists, false otherwise
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const file: File = this.bucket.file(filePath);
      const [exists] = await file.exists();
      this.logger.log(`File exists check for ${filePath}: ${exists}`);
      return exists;
    } catch (error) {
      this.logger.error(
        `Error checking file existence for ${filePath}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Get file metadata from Google Cloud Storage
   * @param filePath - The path to the file
   * @returns Promise<any> - File metadata
   */
  async getFileMetadata(filePath: string): Promise<{
    name?: string;
    size?: string | number;
    contentType?: string;
    timeCreated?: string;
    updated?: string;
    storageClass?: string;
  }> {
    try {
      this.logger.log(`Getting metadata for file: ${filePath}`);

      const file: File = this.bucket.file(filePath);

      const [exists] = await file.exists();
      if (!exists) {
        throw new Error(`File not found: ${filePath}`);
      }

      const [metadata] = await file.getMetadata();

      this.logger.log(`Metadata retrieved for ${filePath}`);
      return metadata;
    } catch (error) {
      this.logger.error(`Failed to get metadata for ${filePath}:`, error);
      throw new Error(`Failed to get file metadata: ${error.message}`);
    }
  }
}
