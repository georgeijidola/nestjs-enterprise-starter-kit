import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { Response } from '../response';
import { ErrorCode } from '../enum/error-codes';

export class ErrorResponse extends Error implements Response {
  @ApiProperty({ enum: ErrorCode, example: ErrorCode.HTTP_UNAUTHORIZED })
  errorCode?: ErrorCode;

  @ApiProperty({ example: 401 })
  statusCode?: number;

  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: null, type: 'null', nullable: true })
  data: any;

  @ApiProperty({ example: [{ message: faker.lorem.sentence() }] })
  errors: { message: string }[];

  constructor({
    message,
    statusCode,
    errorCode,
  }: {
    message: string | string[];
    statusCode?: number;
    errorCode?: ErrorCode;
  }) {
    super(Array.isArray(message) ? message.join('; ') : message);

    this.success = false;
    this.data = null;
    this.errors = Array.isArray(message)
      ? message.map((m) => ({ message: m }))
      : [{ message }];
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    Object.setPrototypeOf(this, ErrorResponse.prototype);

    console.log('error =>', this);
  }
}
