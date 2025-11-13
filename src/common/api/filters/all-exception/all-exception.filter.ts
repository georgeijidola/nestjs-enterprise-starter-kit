import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { handleCustomError } from '../../../errors/handlers/CustomErrorHandler';
import { handleDatabaseError } from '../../../errors/handlers/DatabaseErrorHandler';
import { handleHttpError } from '../../../errors/handlers/HttpErrorHandler';
import { LoggingService } from '../../../helpers/logger/logger.helper';
import { ErrorResponse } from '../../response/error-response/error-response';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new LoggingService();

  catch(
    exception:
      | HttpException
      | PrismaClientKnownRequestError
      | PrismaClientUnknownRequestError
      | PrismaClientRustPanicError
      | PrismaClientInitializationError
      | PrismaClientValidationError
      | ErrorResponse,
    host: ArgumentsHost,
  ) {
    const exceptionName = exception.constructor.name;

    this.logger.error({ message: 'Raw exception', context: exception });

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply | ServerResponse>();
    const request = ctx.getRequest<FastifyRequest>();

    let errorResponse: ErrorResponse;

    if (exception instanceof HttpException) {
      errorResponse = handleHttpError(exception, request);
    } else if (exception instanceof ErrorResponse) {
      errorResponse = handleCustomError(exception);
    } else if (
      exception instanceof PrismaClientKnownRequestError ||
      exception instanceof PrismaClientUnknownRequestError ||
      exception instanceof PrismaClientRustPanicError ||
      exception instanceof PrismaClientInitializationError ||
      exception instanceof PrismaClientValidationError
    ) {
      errorResponse = handleDatabaseError(exception);
    } else if (exceptionName === 'TokenExpiredError') {
      errorResponse = new ErrorResponse({
        message: 'Token expired',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    } else {
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = 'Something went wrong';

      errorResponse = new ErrorResponse({
        message,
        statusCode,
      });
    }

    const statusCode =
      errorResponse.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;

    const apiResponse = { ...errorResponse, statusCode: undefined };

    if (response instanceof ServerResponse) {
      response.statusCode = statusCode;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(apiResponse));
    } else {
      response.status(statusCode).send(apiResponse);
    }
  }
}
