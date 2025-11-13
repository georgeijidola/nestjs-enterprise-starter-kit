import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function CheckHealthSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Check overall health' }),
    ApiResponse({ status: 200, description: 'Health status' }),
  );
}
