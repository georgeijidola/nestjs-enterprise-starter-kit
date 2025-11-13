import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta, PaginationLinks } from './pagination-query.dto';

export class MetaDto {
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
