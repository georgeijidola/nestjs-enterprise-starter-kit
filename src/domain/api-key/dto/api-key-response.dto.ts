import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiKeyStatus, WhitelistType } from '@prisma/client';
import { faker } from '@faker-js/faker';

export class WhitelistEntryResponseDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'Unique identifier for the whitelist entry',
  })
  id: string;

  @ApiProperty({
    enum: WhitelistType,
    example: WhitelistType.DOMAIN,
    description: 'Type of whitelist entry',
  })
  type: WhitelistType;

  @ApiProperty({
    example: 'mystore.com',
    description: 'The whitelisted value (IP, domain, or CIDR range)',
  })
  value: string;

  @ApiProperty({
    example: true,
    description: 'Whether this whitelist entry is currently active',
  })
  isActive: boolean;

  @ApiProperty({
    example: faker.date.past(),
    description: 'When the whitelist entry was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: faker.date.recent(),
    description: 'When the whitelist entry was last updated',
  })
  updatedAt: Date;
}

export class CreatedByDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'Unique identifier of the admin who created this API key',
  })
  id: string;

  @ApiProperty({
    example: faker.person.fullName(),
    description: 'Full name of the admin who created this API key',
  })
  fullName: string;

  @ApiProperty({
    example: faker.internet.email(),
    description: 'Email address of the admin who created this API key',
  })
  email: string;
}

export class ApiKeyResponseDto {
  @ApiProperty({
    example: faker.string.uuid(),
    description: 'Unique identifier for the API key',
  })
  id: string;

  @ApiProperty({
    example: 'Frontend Store API',
    description: 'Human-readable name for the API key',
  })
  name: string;

  @ApiProperty({
    enum: ApiKeyStatus,
    example: ApiKeyStatus.ACTIVE,
    description: 'Current status of the API key',
  })
  status: ApiKeyStatus;

  @ApiPropertyOptional({
    example: 'API key for the main e-commerce frontend application',
    description: 'Optional description explaining the purpose of this API key',
  })
  description?: string;

  @ApiPropertyOptional({
    example: faker.date.future(),
    description: 'When this API key expires (null means no expiration)',
  })
  expiresAt?: Date;

  @ApiPropertyOptional({
    example: faker.date.recent(),
    description: 'When this API key was last used to access the cart API',
  })
  lastUsedAt?: Date;

  @ApiProperty({
    example: faker.date.past(),
    description: 'When this API key was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: faker.date.recent(),
    description: 'When this API key was last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    type: [WhitelistEntryResponseDto],
    description:
      'List of IP addresses, domains, or CIDR ranges allowed to use this API key',
    example: [
      {
        id: faker.string.uuid(),
        type: WhitelistType.DOMAIN,
        value: 'mystore.com',
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      },
      {
        id: faker.string.uuid(),
        type: WhitelistType.IP_ADDRESS,
        value: '203.0.113.42',
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      },
    ],
  })
  whitelistEntries: WhitelistEntryResponseDto[];

  @ApiProperty({
    type: CreatedByDto,
    description: 'Information about the admin who created this API key',
    example: {
      id: faker.string.uuid(),
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
    },
  })
  createdBy: CreatedByDto;
}

export class CreateApiKeyResponseDto {
  @ApiProperty({
    example:
      'ak_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    description:
      '⚠️ IMPORTANT: The plaintext API key - store this securely! It will NEVER be shown again.',
    maxLength: 71,
    minLength: 67,
  })
  apiKey: string;

  @ApiProperty({
    type: ApiKeyResponseDto,
    description: 'Complete information about the created API key',
    example: {
      id: faker.string.uuid(),
      name: 'Frontend Store API',
      status: ApiKeyStatus.ACTIVE,
      description: 'API key for the main e-commerce frontend application',
      expiresAt: null,
      lastUsedAt: null,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      whitelistEntries: [
        {
          id: faker.string.uuid(),
          type: WhitelistType.DOMAIN,
          value: 'mystore.com',
          isActive: true,
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
        },
      ],
      createdBy: {
        id: faker.string.uuid(),
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
      },
    },
  })
  keyData: ApiKeyResponseDto;
}

export class ApiKeyListResponseDto {
  @ApiProperty({
    type: [ApiKeyResponseDto],
    description: 'Array of API keys',
  })
  data: ApiKeyResponseDto[];

  @ApiProperty({
    example: 10,
    description: 'Total number of API keys',
  })
  totalCount: number;
}
