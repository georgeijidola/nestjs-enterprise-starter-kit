import { HttpException, Logger } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ErrorResponse } from '../../api/response/error-response/error-response';
import { ErrorCode } from '../../api/response/enum/error-codes';

const logger = new Logger('HttpErrorHandler');

const httpStatusToErrorCodeMap: Record<number, ErrorCode> = {
  400: ErrorCode.HTTP_BAD_REQUEST,
  401: ErrorCode.HTTP_UNAUTHORIZED,
  403: ErrorCode.HTTP_FORBIDDEN,
  404: ErrorCode.HTTP_NOT_FOUND,
  405: ErrorCode.HTTP_METHOD_NOT_ALLOWED,
  409: ErrorCode.HTTP_CONFLICT,
  422: ErrorCode.HTTP_UNPROCESSABLE_ENTITY,
  429: ErrorCode.HTTP_RATE_LIMITED,
  500: ErrorCode.HTTP_INTERNAL_SERVER_ERROR,
  503: ErrorCode.HTTP_SERVICE_UNAVAILABLE,
};

export const handleHttpError = (
  exception: HttpException,
  request: FastifyRequest,
): ErrorResponse => {
  const statusCode = exception.getStatus();
  const response = exception.getResponse();

  let message: string | string[] = 'Something went wrong';
  let errorCode: ErrorCode | undefined;

  if (typeof response === 'object' && 'message' in response) {
    message = (response as any).message;

    if ('errorCode' in response) {
      errorCode = (response as any).errorCode as ErrorCode;
    } else {
      errorCode = httpStatusToErrorCodeMap[statusCode];
    }
  } else {
    message = response as string;
    errorCode = httpStatusToErrorCodeMap[statusCode];
  }

  logger.error(
    `HTTP ${request.method} ${request.url} failed with status code ${statusCode} ${exception.stack}`,
  );

  return new ErrorResponse({ message, statusCode, errorCode });
};
