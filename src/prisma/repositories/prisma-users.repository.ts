import { Injectable } from '@nestjs/common';
import {
  IUsersRepository,
  User,
} from '../../users/domain/ports/users.repository';
import { PrismaService } from '../prisma.service';
import { UserMapper } from '../mappers/user.mapper';
import { PreferredDisplayMode } from '../../../generated/prisma/enums';
import { LoginDto } from '../../auth/dto';

@Injectable()
export class PrismaUserRepository implements IUsersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userMapper: UserMapper,
  ) {}

  async create({ email, password: passwordHash }: LoginDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: { email, passwordHash },
    });

    return this.userMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.userMapper.toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.userMapper.toDomain(user) : null;
  }

  async updateRefreshToken(id: string, token: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { hashedRefreshToken: token },
    });
  }

  async updatePreferredDisplayMode(
    id: string,
    preferredDisplayMode: PreferredDisplayMode,
  ): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { preferredDisplayMode },
    });

    return this.userMapper.toDomain(user);
  }
}
