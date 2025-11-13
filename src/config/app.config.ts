import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IsString,
  IsNumber,
  IsIP,
  IsDefined,
  Min,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

@Injectable()
export class AppConfiguration {
  private static readonly logger = new Logger('AppConfiguration');

  // SERVER CONFIGURATION PROPERTIES
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  private _port: number;

  @IsIP()
  @IsString()
  private _serverIp: string;

  // JWT CONFIGURATION PROPERTIES
  @IsString()
  @IsDefined()
  @MinLength(32, {
    message: 'JWT_SECRET should be at least 32 characters for security',
  })
  private _jwtSecret: string;

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  private _jwtSecretExpire: number;

  // EMAIL CONFIGURATION PROPERTIES
  @IsString()
  @IsDefined()
  private _emailFrom: string;

  @IsString()
  @IsDefined()
  private _resendApiKey: string;

  // CACHE CONFIGURATION PROPERTIES
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  private _cacheTtl: number;

  // GOOGLE CLOUD STORAGE CONFIGURATION PROPERTIES
  @IsString()
  @IsDefined()
  private _gcsProjectId: string;

  @IsString()
  @IsDefined()
  private _gcsBucketName: string;

  @IsString()
  @IsOptional()
  private _gcsKeyFilePath: string;

  @IsString()
  @IsOptional()
  private _gcsCredentials: string;

  private _gcsCredentialsParsed: object | null = null;

  constructor(private configService: ConfigService) {
    this.loadAndValidateConfig();
  }

  private loadAndValidateConfig(): void {
    // Load all configuration values and assign to decorated properties
    this._port = this.getRequiredNumber('PORT', 3000);
    this._serverIp = this.getRequiredString('SERVER_IP', '0.0.0.0');
    this._jwtSecret = this.getRequiredString('JWT_SECRET');
    this._jwtSecretExpire = this.getRequiredNumber('JWT_SECRET_EXPIRE', 3600);
    this._emailFrom = this.getRequiredString('EMAIL_FROM');
    this._resendApiKey = this.getRequiredString('RESEND_API_KEY');
    this._cacheTtl = this.getRequiredNumber('CACHE_TTL', 3600);
    this._gcsProjectId = this.getRequiredString('GCS_PROJECT_ID');
    this._gcsBucketName = this.getRequiredString('GCS_BUCKET_NAME');
    this._gcsKeyFilePath = this.getRequiredString('GCS_KEY_FILE_PATH', '');
    this._gcsCredentials = this.getRequiredString('GCS_CREDENTIALS', '');
    this._gcsCredentialsParsed = this.parseGcsCredentials();
  }

  private static handleError(key: string, error: Error): void {
    AppConfiguration.logger.error(
      `Error fetching ${key}: ${error.message}`,
      error.stack,
    );
  }

  private getRequiredString(key: string, fallback?: string): string {
    try {
      const value = this.configService.get<string>(key);
      if (!value || value.trim() === '') {
        if (fallback !== undefined) {
          AppConfiguration.logger.warn(
            `${key} not found, using fallback: ${fallback}`,
          );
          return fallback;
        }
        throw new Error(
          `${key} is required but not defined in environment variables`,
        );
      }
      return value.trim();
    } catch (error) {
      AppConfiguration.handleError(key, error);
      if (fallback !== undefined) {
        return fallback;
      }
      throw error;
    }
  }

  private getRequiredNumber(key: string, fallback?: number): number {
    try {
      const value = this.configService.get<string>(key);
      if (!value || value.trim() === '') {
        if (fallback !== undefined) {
          AppConfiguration.logger.warn(
            `${key} not found, using fallback: ${fallback}`,
          );
          return fallback;
        }
        throw new Error(
          `${key} is required but not defined in environment variables`,
        );
      }
      const result = parseInt(value.trim(), 10);
      if (isNaN(result)) {
        throw new Error(`${key} must be a valid number, received: ${value}`);
      }
      return result;
    } catch (error) {
      AppConfiguration.handleError(key, error);
      if (fallback !== undefined) {
        return fallback;
      }
      throw error;
    }
  }

  private validateIpAddress(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return (
      ipv4Regex.test(ip) ||
      ipv6Regex.test(ip) ||
      ip === 'localhost' ||
      ip === '0.0.0.0'
    );
  }

  // SERVER CONFIGURATION
  get port(): number {
    // Additional runtime validation on top of class-validator
    if (this._port < 1 || this._port > 65535) {
      AppConfiguration.logger.warn(
        `Invalid port number: ${this._port}, using fallback: 3000`,
      );
      return 3000;
    }
    return this._port;
  }

  get serverIp(): string {
    // Additional IP validation on top of class-validator @IsIP
    if (!this.validateIpAddress(this._serverIp)) {
      AppConfiguration.logger.warn(
        `Invalid IP address format: ${this._serverIp}, using fallback: 0.0.0.0`,
      );
      return '0.0.0.0';
    }
    return this._serverIp;
  }

  // JWT CONFIGURATION
  get jwtSecret(): string {
    // Additional length validation on top of class-validator @MinLength
    if (this._jwtSecret.length < 32) {
      AppConfiguration.logger.warn(
        'JWT_SECRET should be at least 32 characters for security',
      );
    }
    return this._jwtSecret;
  }

  get jwtSecretExpire(): number {
    // Additional range validation
    if (this._jwtSecretExpire < 300) {
      // Minimum 5 minutes
      AppConfiguration.logger.warn(
        `JWT expiry too short: ${this._jwtSecretExpire}s, minimum recommended: 300s`,
      );
    }
    return this._jwtSecretExpire;
  }

  // EMAIL CONFIGURATION
  get emailFrom(): string {
    return `'Ayo & Styles' <${this._emailFrom}>`;
  }

  get resendApiKey(): string {
    return this._resendApiKey;
  }

  // CACHE CONFIGURATION
  get cacheTtl(): number {
    // Additional range validation
    if (this._cacheTtl < 60) {
      // Minimum 1 minute
      AppConfiguration.logger.warn(
        `Cache TTL too short: ${this._cacheTtl}s, minimum recommended: 60s`,
      );
    }
    return this._cacheTtl;
  }

  // GOOGLE CLOUD STORAGE CONFIGURATION
  get gcsProjectId(): string {
    if (!this._gcsProjectId || this._gcsProjectId.trim() === '') {
      throw new Error('GCS_PROJECT_ID is required for Google Cloud Storage');
    }
    return this._gcsProjectId;
  }

  get gcsBucketName(): string {
    if (!this._gcsBucketName || this._gcsBucketName.trim() === '') {
      throw new Error('GCS_BUCKET_NAME is required for Google Cloud Storage');
    }
    return this._gcsBucketName;
  }

  get gcsKeyFilePath(): string {
    return this._gcsKeyFilePath;
  }

  get gcsCredentials(): string {
    return this._gcsCredentials;
  }

  get gcsCredentialsParsed(): object | null {
    return this._gcsCredentialsParsed;
  }

  private parseGcsCredentials(): object | null {
    if (!this._gcsCredentials || this._gcsCredentials.trim() === '') {
      return null;
    }

    try {
      const parsed = JSON.parse(this._gcsCredentials);
      AppConfiguration.logger.log(
        'GCS credentials JSON validated successfully',
      );
      return parsed;
    } catch (error) {
      AppConfiguration.logger.error(
        'Failed to parse GCS_CREDENTIALS JSON',
        error,
      );
      throw new Error('Invalid GCS_CREDENTIALS format. Must be valid JSON.');
    }
  }

  // CLASS-VALIDATOR VALIDATION METHOD
  public async validateWithClassValidator(): Promise<any[]> {
    const { validate } = await import('class-validator');
    return await validate(this);
  }

  // UTILITY METHOD FOR DEBUGGING
  public validateAllConfigs(): { [key: string]: boolean } {
    const results: { [key: string]: boolean } = {};

    try {
      void this.port;
      results.port = true;
    } catch {
      results.port = false;
    }

    try {
      void this.serverIp;
      results.serverIp = true;
    } catch {
      results.serverIp = false;
    }

    try {
      void this.jwtSecret;
      results.jwtSecret = true;
    } catch {
      results.jwtSecret = false;
    }

    try {
      void this.jwtSecretExpire;
      results.jwtSecretExpire = true;
    } catch {
      results.jwtSecretExpire = false;
    }

    try {
      void this.emailFrom;
      results.emailFrom = true;
    } catch {
      results.emailFrom = false;
    }

    try {
      void this.resendApiKey;
      results.resendApiKey = true;
    } catch {
      results.resendApiKey = false;
    }

    try {
      void this.cacheTtl;
      results.cacheTtl = true;
    } catch {
      results.cacheTtl = false;
    }

    try {
      void this.gcsProjectId;
      results.gcsProjectId = true;
    } catch {
      results.gcsProjectId = false;
    }

    try {
      void this.gcsBucketName;
      results.gcsBucketName = true;
    } catch {
      results.gcsBucketName = false;
    }

    try {
      void this.gcsKeyFilePath;
      results.gcsKeyFilePath = true;
    } catch {
      results.gcsKeyFilePath = false;
    }

    try {
      void this.gcsCredentials;
      results.gcsCredentials = true;
    } catch {
      results.gcsCredentials = false;
    }

    return results;
  }
}
