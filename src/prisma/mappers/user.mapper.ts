import { Injectable } from '@nestjs/common';
import { DomainMapper } from './base.mapper';
import { User as PrismaUser } from '../../../generated/prisma/client';
import { User } from 'src/common/domain';

@Injectable()
export class UserMapper extends DomainMapper<PrismaUser, User> {
  toDomain(prisma: PrismaUser): User {
    return {
      id: prisma.id,
      email: prisma.email,
      passwordHash: prisma.passwordHash,
      hashedRefreshToken: prisma.hashedRefreshToken,
      preferredDisplayMode: prisma.preferredDisplayMode,
      createdAt: prisma.createdAt,
    };
  }
}
