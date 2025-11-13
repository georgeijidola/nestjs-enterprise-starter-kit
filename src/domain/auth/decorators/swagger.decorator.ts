import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function SignUpSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'User registration' }),
    ApiResponse({ status: 201, description: 'User created successfully' }),
    ApiResponse({ status: 400, description: 'Bad request' }),
  );
}

export function SignInSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'User login' }),
    ApiResponse({ status: 200, description: 'Login successful' }),
    ApiResponse({ status: 401, description: 'Invalid credentials' }),
  );
}
