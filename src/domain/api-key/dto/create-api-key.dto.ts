import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
  IsDateString,
  ValidateNested,
  ArrayMinSize,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WhitelistType } from '@prisma/client';

export function IsNotPastDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return true;
          const inputDate = new Date(value);
          const now = new Date();
          return inputDate >= now;
        },
        defaultMessage() {
          return 'Expiry date cannot be in the past';
        },
      },
    });
  };
}

export class CreateWhitelistEntryDto {
  @ApiProperty({
    enum: WhitelistType,
    description: 'Type of whitelist entry',
    example: WhitelistType.DOMAIN,
    examples: {
      domain: {
        value: WhitelistType.DOMAIN,
        description: 'Allow access from a specific domain',
      },
      ip: {
        value: WhitelistType.IP_ADDRESS,
        description: 'Allow access from a specific IP address',
      },
      cidr: {
        value: WhitelistType.CIDR_RANGE,
        description: 'Allow access from a range of IP addresses',
      },
    },
  })
  @IsEnum(WhitelistType)
  type: WhitelistType;

  @ApiProperty({
    description:
      'The value to whitelist - IP address, domain name, or CIDR range',
    examples: {
      domain: {
        value: 'mystore.com',
        description: 'Domain name (for DOMAIN type)',
      },
      ip: {
        value: '203.0.113.42',
        description: 'Single IP address (for IP_ADDRESS type)',
      },
      cidr: {
        value: '192.168.1.0/24',
        description:
          'CIDR range covering 192.168.1.1 to 192.168.1.254 (for CIDR_RANGE type)',
      },
    },
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreateApiKeyDto {
  @ApiProperty({
    description: 'Human-readable name to identify this API key',
    example: 'Frontend Store API',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description:
      'Optional description explaining what this API key is used for',
    example:
      'API key for the main e-commerce frontend application to access cart endpoints',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description:
      'Optional expiration date in ISO format. If not provided, the key never expires. Must be a future date.',
    example: '2025-12-31T23:59:59Z',
    format: 'date-time',
  })
  @IsDateString()
  @IsNotPastDate({ message: 'Expiry date cannot be in the past' })
  @IsOptional()
  expiresAt?: string;

  @ApiProperty({
    type: [CreateWhitelistEntryDto],
    description:
      'List of IP addresses, domains, or CIDR ranges allowed to use this API key. At least one entry is required.',
    example: [
      {
        type: WhitelistType.DOMAIN,
        value: 'mystore.com',
      },
      {
        type: WhitelistType.IP_ADDRESS,
        value: '203.0.113.42',
      },
      {
        type: WhitelistType.CIDR_RANGE,
        value: '192.168.1.0/24',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one whitelist entry is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateWhitelistEntryDto)
  whitelistEntries: CreateWhitelistEntryDto[];
}
