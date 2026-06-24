import { Injectable } from '@nestjs/common';
import { IImportsRepository, Import } from 'src/common/domain';
import { PrismaService } from '../prisma.service';
import { ImportMapper } from '../mappers';

@Injectable()
export class PrismaImportsRepository implements IImportsRepository {
  constructor(
    private prisma: PrismaService,
    private importMapper: ImportMapper,
  ) {}

  async create(userId: string): Promise<Import> {
    const importRecord = await this.prisma.imports.create({
      data: { userId },
    });

    return this.importMapper.toDomain(importRecord);
  }

  async findById(id: string): Promise<Import | null> {
    const importRecord = await this.prisma.imports.findUnique({
      where: { id },
    });
    return importRecord ? this.importMapper.toDomain(importRecord) : null;
  }
}
