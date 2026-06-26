import { Injectable } from '@nestjs/common';
import { DomainMapper } from './base.mapper';
import { Imports as PrismaImports } from '../../../generated/prisma/client';
import { Import } from '../../imports/domain/entities/import';

@Injectable()
export class ImportMapper extends DomainMapper<PrismaImports, Import> {
  toDomain(prisma: PrismaImports): Import {
    return {
      id: prisma.id,
      userId: prisma.userId,
      importedAt: prisma.importedAt,
    };
  }
}
