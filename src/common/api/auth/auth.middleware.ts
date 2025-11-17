import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AppConfiguration } from '../../../config/app.config';
import { AuthenticationUtilityService } from '../../helpers/authentication-utility/authentication-utility.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private config: AppConfiguration,
    private authenticationUtilityService: AuthenticationUtilityService,
    private prismaClient: PrismaClient,
  ) {}

  async use(
    req: FastifyRequest,
    res: FastifyReply,
    next: (error?: Error | unknown) => void,
  ) {
    try {
      const token = req.headers.authorization;
      const [userId] = this.authenticationUtilityService.decipherToken(token);

      if (!userId) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.prismaClient.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true, isEmailVerified: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      req.user = user;

      next();
    } catch (error) {
      next(error);
    }
  }
}
