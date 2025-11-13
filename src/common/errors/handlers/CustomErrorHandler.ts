import { HttpStatus, Logger } from '@nestjs/common';
import { ErrorResponse } from '../../api/response/error-response/error-response';

const logger = new Logger('HttpErrorHandler');

export const handleCustomError = (exception: ErrorResponse): ErrorResponse => {
  const statusCode = exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

  logger.error(`Exception with status code ${statusCode} ${exception}`);

  return exception;
};
