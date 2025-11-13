import { HttpStatus, Logger } from '@nestjs/common';
import { ErrorCode } from '../../api/response/enum/error-codes';
import { ErrorResponse } from '../../api/response/error-response/error-response';

const logger = new Logger('CacheErrorHandler');

export const handleCacheError = (error: Error): ErrorResponse => {
  logger.error(`Cache error: ${error.message}`, error.stack);

  return new ErrorResponse({
    message: error.message || 'A caching error occurred.',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: ErrorCode.CACHE_ERROR,
  });
};
