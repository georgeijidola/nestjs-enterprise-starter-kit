import { ConsoleLogger, HttpStatus } from '@nestjs/common';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { ErrorCode } from '../../api/response/enum/error-codes';
import { ErrorResponse } from '../../api/response/error-response/error-response';

const logger = new ConsoleLogger('DatabaseErrorHandler');

export const handleDatabaseError = (
  exception:
    | PrismaClientKnownRequestError
    | PrismaClientUnknownRequestError
    | PrismaClientRustPanicError
    | PrismaClientInitializationError
    | PrismaClientValidationError,
): ErrorResponse => {
  let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
  let message: string = 'Something went wrong';
  let errorCode = ErrorCode.DB_CONNECTION_FAILED;

  if (exception instanceof PrismaClientKnownRequestError) {
    switch (exception.code) {
      case 'P1008':
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Operation timed out.';
        errorCode = ErrorCode.DB_CONNECTION_FAILED;

        logger.error(
          `Database connection timeout: ${exception.message}`,
          exception.stack,
        );
        break;

      case 'P2002':
        statusCode = HttpStatus.CONFLICT;
        message = 'A record with this value already exists.';
        errorCode = ErrorCode.DB_DUPLICATE_KEY;

        logger.error(
          `Unique constraint violation: ${exception.message}`,
          exception.stack,
        );
        break;

      case 'P2003':
        statusCode = HttpStatus.CONFLICT;
        message = 'There is a problem with your request.';
        errorCode = ErrorCode.DB_RECORD_NOT_FOUND;

        logger.error(
          `Foreign key constraint violation: ${exception.message}`,
          exception.stack,
        );
        break;

      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;
        message = `No record found with the provided ID.`;
        errorCode = ErrorCode.DB_RECORD_NOT_FOUND;

        logger.error(`Record not found: ${exception.message}`, exception.stack);
        break;

      case 'P20234':
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'The provided relation does not exist.';

        logger.error(
          `Relation does not exist: ${exception.message}`,
          exception.stack,
        );

        break;

      default:
        logger.error(`${exception.message}:`, exception.stack);
        errorCode = ErrorCode.HTTP_INTERNAL_SERVER_ERROR;
        break;
    }
  } else {
    logger.error(`${exception.message}:`, exception.stack);
  }

  return new ErrorResponse({
    message,
    statusCode,
    errorCode,
  });
};
