import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import { Log } from './interfaces/log.interface';

@Injectable()
export class LoggingService implements LoggerService {
  private logger: Logger;

  constructor() {
    const { combine, timestamp, simple, prettyPrint } = format;

    this.logger = createLogger({
      transports: [
        new transports.Console({
          format: combine(timestamp(), simple(), prettyPrint()),
        }),
      ],
    });
  }

  log({ message, context }: Log) {
    this.logger.info(message, { context });
  }

  error({ message, context }: Log) {
    this.logger.error(message, { context });
  }

  warn({ message, context }: Log) {
    this.logger.warn(message, { context });
  }

  debug({ message, context }: Log) {
    this.logger.debug(message, { context });
  }

  verbose({ message, context }: Log) {
    this.logger.debug(message, { context });
  }
}
