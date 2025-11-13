import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../loaders/database/prisma.loader';
import { CreateUserDto } from '../dto/create-user.dto';
import { CacheService } from '../../../common/helpers/cache/cache.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: 'temp-password', // Should be hashed in real implementation
        role: (createUserDto.role as UserRole) || UserRole.USER,
      },
    });
  }

  async findAll() {
    const cacheKey = 'users:all';
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    await this.cacheService.set(cacheKey, users, 300);
    return users;
  }

  async findOne(id: string) {
    const cacheKey = `user:${id}`;
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (user) {
      await this.cacheService.set(cacheKey, user, 300);
    }

    return user;
  }

  async update(id: string, updateUserDto: any) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    await this.cacheService.del(`user:${id}`);
    await this.cacheService.del('users:all');

    return user;
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } });
    await this.cacheService.del(`user:${id}`);
    await this.cacheService.del('users:all');
  }
}
