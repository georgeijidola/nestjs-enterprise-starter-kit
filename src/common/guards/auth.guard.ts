import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { AuthenticationUtilityService } from '../helpers/authentication-utility/authentication-utility.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly authenticationUtilityService: AuthenticationUtilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      // Verify and decode the token
      const payload = this.authenticationUtilityService.decipherToken(
        `Bearer ${token}`,
      );
      const userId = payload[0]; // Get userId from payload

      // Fetch user from database
      const user = await this.prismaClient.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          isEmailVerified: true,
          role: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user.isEmailVerified) {
        throw new UnauthorizedException('Email not verified');
      }

      // Attach user to request for use in controllers
      request.user = user;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
