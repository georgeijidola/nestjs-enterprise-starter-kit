import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AppConfiguration } from '../../../config/app.config';
import { AuthenticationUtilityService } from '../../helpers/authentication-utility/authentication-utility.service';
import { UserExistenceUtil } from '../../utils/user-existence.util';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private config: AppConfiguration,
    private authenticationUtilityService: AuthenticationUtilityService,
    private prismaClient: PrismaClient,
  ) {}

  async use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const token = req.headers.authorization;

    const userId: string =
      this.authenticationUtilityService.decipherToken(token)[0];

    const user = await UserExistenceUtil.assertUserExistsById(
      userId,
      this.prismaClient,
      'User',
      {
        id: true,
        role: true,
      },
    );

    req.user = user;

    next();
  }
}
