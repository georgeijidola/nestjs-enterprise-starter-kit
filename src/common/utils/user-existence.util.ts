import { HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { ErrorCode } from '../api/response/enum/error-codes';
import { ErrorResponse } from '../api/response/error-response/error-response';

export class UserExistenceUtil {
  static async assertUserExistsById(
    id: string,
    prisma: PrismaClient,
    player: string = 'User',
    select: any = {
      id: true,
    },
  ): Promise<Partial<User>> {
    const user = await prisma.user.findUnique({ where: { id }, select });

    if (!user)
      throw new NotFoundException(
        `${player} not found`,
        ErrorCode.HTTP_NOT_FOUND,
      );

    return user;
  }

  static async assertUserExists(
    email: string,
    prisma: PrismaClient,
    player: string = 'User',
    select: any = {
      id: true,
    },
  ): Promise<Partial<User>> {
    const user = await prisma.user.findUnique({ where: { email }, select });

    if (!user)
      throw new NotFoundException(
        `${player} not found`,
        ErrorCode.HTTP_NOT_FOUND,
      );

    return user;
  }

  static async assertUserDoesNotExist(
    email: string,
    prisma: PrismaClient,
    message: string = 'User already exists',
  ): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user)
      throw new ErrorResponse({
        message,
        statusCode: HttpStatus.CONFLICT,
        errorCode: ErrorCode.HTTP_CONFLICT,
      });
  }
}
