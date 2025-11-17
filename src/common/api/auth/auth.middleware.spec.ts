import { Test, TestingModule } from '@nestjs/testing';
import { AuthMiddleware } from './auth.middleware';
import { AppConfiguration } from '../../../config/app.config';
import { AuthenticationUtilityService } from '../../helpers/authentication-utility/authentication-utility.service';
import { PrismaClient } from '@prisma/client';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;

  const mockConfig = {};
  const mockAuthService = {
    decipherToken: jest.fn(),
  };
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthMiddleware,
        { provide: AppConfiguration, useValue: mockConfig },
        { provide: AuthenticationUtilityService, useValue: mockAuthService },
        { provide: PrismaClient, useValue: mockPrisma },
      ],
    }).compile();

    middleware = module.get<AuthMiddleware>(AuthMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
