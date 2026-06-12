import { IUsersRepository } from '../../users/domain/user-repository.js';
import { User } from '../../users/domain/user.js';
import { PrismaService } from '../prisma.service.js';
import { User as PrismaUser } from '../../../generated/prisma/client.js';
import { CreateUserDto } from '../../users/dto/create-user.dto.js';

export class PrismaUserRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async create({
    email,
    password: passwordHash,
  }: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    return this.mapToDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.mapToDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.mapToDomain(user) : null;
  }

  private mapToDomain(prismaUser: PrismaUser): User {
    return {
      id: prismaUser.id,
      email: prismaUser.email,
      preferredDisplayMode: prismaUser.preferredDisplayMode,
      createdAt: prismaUser.createdAt,
    };
  }
}
