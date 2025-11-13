import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CursorPaginationQueryDto {
  @ApiPropertyOptional({
    name: 'page[size]',
    description: 'Max number of results to return',
    default: 10,
    minimum: 1,
    maximum: 50,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  ['page[size]']?: number;

  @ApiPropertyOptional({ description: 'Cursor to fetch items after this ID' })
  @IsOptional()
  ['page[after]']?: string;

  @ApiPropertyOptional({ description: 'Cursor to fetch items before this ID' })
  @IsOptional()
  ['page[before]']?: string;

  @ApiPropertyOptional({
    description: 'Field and direction to sort by. E.g. `createdAt`, `-name`',
    example: ['createdAt', '-createdAt', 'name', '-name'],
    type: [String],
  })
  @IsOptional()
  sort?: string[];

  @ApiPropertyOptional({
    description:
      'Filter by name (example: ?filter[name]=John or filter[name]=`*ohn*`)',
  })
  @IsOptional()
  ['filter[name]']?: string;

  @ApiPropertyOptional({
    description:
      'Filter by category name - for products endpoint (example: ?filter[category.name]=Suits)',
  })
  @IsOptional()
  ['filter[category.name]']?: string;

  @ApiPropertyOptional({
    description:
      'Filter by exact date (example: ?filter[createdAt]=2025-08-05)',
  })
  @IsOptional()
  @IsDateString()
  ['filter[publishedAt]']?: string;

  @ApiPropertyOptional({
    description:
      'Filter by start date (example: ?filter[publishedAt][gte]=2025-08-01)',
  })
  @IsOptional()
  @IsDateString()
  ['filter[publishedAt][gte]']?: string;

  @ApiPropertyOptional({
    description:
      'Filter by end date (example: ?filter[publishedAt][lte]=2025-08-10)',
  })
  @IsOptional()
  @IsDateString()
  ['filter[publishedAt][lte]']?: string;

  @ApiPropertyOptional({
    description:
      'Filter by exact created date (example: ?filter[createdAt]=2025-08-05)',
  })
  @IsOptional()
  @IsDateString()
  ['filter[createdAt]']?: string;

  @ApiPropertyOptional({
    description:
      'Filter by created date start (example: ?filter[createdAt][gte]=2025-08-01)',
  })
  @IsOptional()
  @IsDateString()
  ['filter[createdAt][gte]']?: string;

  @ApiPropertyOptional({
    description:
      'Filter by created date end (example: ?filter[createdAt][lte]=2025-08-10)',
  })
  @IsOptional()
  @IsDateString()
  ['filter[createdAt][lte]']?: string;
}

export class CategoryDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier of the category',
  })
  id: string;

  @ApiProperty({
    example: 'Electronics',
    description: 'Name of the category',
  })
  name: string;

  @ApiProperty({
    example: '2025-08-01T12:00:00.000Z',
    description: 'Timestamp when the category was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-08-05T12:00:00.000Z',
    description: 'Timestamp when the category was last updated',
  })
  updatedAt: Date;
}

export class PaginationMeta {
  @ApiProperty({
    example: true,
    description: 'Indicates if there is a next page',
  })
  hasNextPage: boolean;

  @ApiProperty({
    example: false,
    description: 'Indicates if there is a previous page',
  })
  hasPreviousPage: boolean;

  @ApiPropertyOptional({
    example: 'eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIs',
    description: 'Cursor representing the start of the current page',
  })
  startCursor?: string;

  @ApiPropertyOptional({
    example:
      'eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMSIsImNyZWF',
    description: 'Cursor representing the end of the current page',
  })
  endCursor?: string;

  @ApiPropertyOptional({
    example:
      'eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMSIsImNyZWF',
    description: 'Cursor representing the end of the results',
  })
  lastCursor?: string;

  @ApiPropertyOptional({
    example: 100,
    description: 'Total number of items',
  })
  totalCount?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Offset used for pagination',
  })
  offset?: number;
}

export class PaginationLinks {
  @ApiPropertyOptional({
    example: 'https://api.example.com/categories?page%5Bsize%5D=10',
    description: 'URL to the first page of results',
  })
  first?: string;

  @ApiPropertyOptional({
    example:
      'https://api.example.com/categories?page%5Bbefore%5D=eyJpZCI6IjU1MGU4NDAwIn0',
    description: 'URL to the previous page of results',
  })
  prev?: string;

  @ApiPropertyOptional({
    example:
      'https://api.example.com/categories?page%5Bafter%5D=eyJpZCI6IjU1MGU4NDAwIn0',
    description: 'URL to the next page of results',
  })
  next?: string;

  @ApiPropertyOptional({
    example:
      'https://api.example.com/categories?page%5Bsize%5D=10&page%5Bafter%5D=eyJpZCI6IjU1MGU4NDAwIn0',
    description: 'URL to the last page of results',
  })
  last?: string;
}

export class CategoriesResponse {
  @ApiProperty({
    type: [CategoryDto],
    description: 'Array of category objects',
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Electronics',
        adminId: '550e8400-e29b-41d4-a716-446655440000',
        createdAt: '2025-08-01T12:00:00.000Z',
        updatedAt: '2025-08-05T12:00:00.000Z',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Books',
        adminId: '550e8400-e29b-41d4-a716-446655440000',
        createdAt: '2025-08-02T12:00:00.000Z',
        updatedAt: '2025-08-04T12:00:00.000Z',
      },
    ],
  })
  data: CategoryDto[];

  @ApiProperty({
    type: PaginationMeta,
    description: 'Pagination metadata',
    example: {
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor:
        'eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImNyZWF0ZWR',
      endCursor:
        'eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMSIsImNyZWF0ZWR',
      totalCount: 100,
    },
  })
  meta: PaginationMeta;

  @ApiProperty({
    type: PaginationLinks,
    description: 'Pagination links',
    example: {
      first: 'https://api.example.com/categories?page%5Bsize%5D=10',
      next: 'https://api.example.com/categories?page%5Bafter%5D=eyJpZCI6IjU1MGU4NDAwIn0',
    },
  })
  links: PaginationLinks;
}
