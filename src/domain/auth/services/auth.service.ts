import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../loaders/database/prisma.loader';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const hashedPassword = await argon2.hash(signUpDto.password);

    const user = await this.prisma.user.create({
      data: {
        name: signUpDto.name,
        email: signUpDto.email,
        password: hashedPassword,
      },
    });

    return { ...user, password: undefined };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: signInDto.email },
    });

    if (!user || !(await argon2.verify(user.password, signInDto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { ...user, password: undefined },
    };
  }
}
