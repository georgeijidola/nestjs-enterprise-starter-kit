import { HttpStatus, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { generate } from 'otp-generator';
import { FastifyRequest } from 'fastify';
import { AppConfiguration } from '../../../config/app.config';
import { ErrorResponse } from '../../api/response/error-response/error-response';
import * as crypto from 'crypto';

@Injectable()
export class AuthenticationUtilityService {
  constructor(private readonly config: AppConfiguration) {}

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await argon2.verify(hashedPassword, password);
  }

  signToken(userId: string) {
    if (!this.config.jwtSecret) {
      throw new Error(
        `JWT_SECRET is not configured. Value: ${this.config.jwtSecret}`,
      );
    }
    return jwt.sign({ userId }, this.config.jwtSecret, {
      expiresIn: this.config.jwtSecretExpire,
    });
  }

  decipherToken(token?: string) {
    if (token && token.startsWith('Bearer')) {
      token = token.split(' ')[1];
    } else {
      throw new ErrorResponse({
        message: 'Token not found.',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
    try {
      const decoded = jwt.verify(token, this.config.jwtSecret) as {
        userId: string;
      };
      return [decoded.userId, token];
    } catch (error) {
      if (error && error.name === 'TokenExpiredError') {
        throw new ErrorResponse({
          message: 'Token has expired.',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      } else if (error && error.name === 'JsonWebTokenError') {
        throw new ErrorResponse({
          message: 'Invalid token.',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      throw new ErrorResponse({
        message: 'Token verification failed.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  generateOtp() {
    return generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
  }

  createFingerprint = (req: FastifyRequest) => {
    const headers = req.headers;
    const fingerprint = {
      userAgent: headers['user-agent'],
      acceptLanguage: headers['accept-language'],
      acceptEncoding: headers['accept-encoding'],
      secChUa: headers['sec-ch-ua'],
      secChUaPlatform: headers['sec-ch-ua-platform'],
      secChUaMobile: headers['sec-ch-ua-mobile'],
    };

    return crypto
      .createHash('sha256')
      .update(JSON.stringify(fingerprint))
      .digest('hex');
  };
}
