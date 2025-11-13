import { ErrorCode } from './../../api/response/enum/error-codes';
import { HttpStatus, Logger } from '@nestjs/common';
import { ErrorResponse } from '../../api/response/error-response/error-response';

const logger = new Logger('QueueErrorHandler');

export const handleQueueError = (error: Error): ErrorResponse => {
  logger.error(`Queue processing error: ${error.message}`, error.stack);

  return new ErrorResponse({
    message:
      error.message || 'An error occurred while processing the job queue.',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: ErrorCode.QUEUE_ERROR,
  });
};
