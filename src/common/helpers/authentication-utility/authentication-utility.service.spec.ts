import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationUtilityService } from './authentication-utility.service';
import { ErrorResponse } from '../../api/response/error-response/error-response';
import { faker } from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { AppConfiguration } from '../../../config/app.config';

describe('AuthenticationUtilityService', () => {
  let service: AuthenticationUtilityService;

  const mockAppConfig = {
    jwtSecret: 'test-secret',
    jwtSecretExpire: '1s',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationUtilityService,
        {
          provide: AppConfiguration,
          useValue: mockAppConfig,
        },
      ],
    }).compile();

    service = module.get<AuthenticationUtilityService>(
      AuthenticationUtilityService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword & comparePassword', () => {
    it('should hash and validate password correctly', async () => {
      const password = faker.internet.password();
      const hashed = await service.hashPassword(password);

      expect(typeof hashed).toBe('string');
      expect(await service.comparePassword(password, hashed)).toBe(true);
      expect(
        await service.comparePassword(faker.internet.password(), hashed),
      ).toBe(false);
    }, 15000); // Increased timeout to 15 seconds for bcrypt operations
  });

  describe('signToken & decipherToken', () => {
    it('should sign and decode a valid token', () => {
      const userId = faker.string.uuid();
      const token = service.signToken(userId);
      const bearerToken = `Bearer ${token}`;
      const [decodedText, rawToken] = service.decipherToken(bearerToken);

      expect(decodedText).toBe(userId);
      expect(rawToken).toBe(token);
    });

    it('should throw ErrorResponse if token is missing', () => {
      expect(() => service.decipherToken()).toThrow(ErrorResponse);
    });

    it('should throw ErrorResponse if token is malformed', () => {
      expect(() => service.decipherToken('Bearer invalid.token.here')).toThrow(
        ErrorResponse,
      );
    });

    it('should throw ErrorResponse if token is expired', async () => {
      const token = jwt.sign(
        { text: faker.string.uuid() },
        mockAppConfig.jwtSecret,
        {
          expiresIn: '1s',
        },
      );
      const bearerToken = `Bearer ${token}`;

      await new Promise((r) => setTimeout(r, 1100)); // wait for expiration

      expect(() => service.decipherToken(bearerToken)).toThrow(ErrorResponse);

      try {
        service.decipherToken(bearerToken);
      } catch (e) {
        expect(e.message).toBe('Token has expired.');
        expect(e.statusCode).toBe(401);
      }
    });
  });

  describe('generateOtp', () => {
    it('should generate a 6-digit numeric OTP', () => {
      const otp = service.generateOtp();
      expect(otp).toMatch(/^\d{6}$/);
    });
  });
});
