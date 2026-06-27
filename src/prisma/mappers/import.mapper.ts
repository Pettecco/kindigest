import { Injectable } from '@nestjs/common';
import { DomainMapper } from './base.mapper';
import { Import as PrismaImports } from '../../../generated/prisma/client';
import { Import } from '../../imports/domain/entities/import';

@Injectable()
export class ImportMapper extends DomainMapper<PrismaImports, Import> {
  toDomain(prisma: PrismaImports): Import {
    return {
      id: prisma.id,
      userId: prisma.userId,
      originalFileName: prisma.originalFileName,
      status: prisma.status,
      createdAt: prisma.createdAt,
      startedAt: prisma.startedAt,
      completedAt: prisma.completedAt,
      failedAt: prisma.failedAt,
      errorMessage: prisma.errorMessage,
    };
  }
}
