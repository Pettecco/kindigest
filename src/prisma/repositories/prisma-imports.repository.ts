import { Injectable } from '@nestjs/common';
import { IImportsRepository, Import, CreateImportInput, FindImportByIdInput } from 'src/common/domain';
import { PrismaService } from '../prisma.service';
import { ImportMapper } from '../mappers';

@Injectable()
export class PrismaImportsRepository implements IImportsRepository {
  constructor(
    private prisma: PrismaService,
    private importMapper: ImportMapper,
  ) {}

  async create(createImportInput: CreateImportInput): Promise<Import> {
    const importRecord = await this.prisma.imports.create({
      data: { userId: createImportInput.userId },
    });

    return this.importMapper.toDomain(importRecord);
  }

  async findById(findImportByIdInput: FindImportByIdInput): Promise<Import | null> {
    const importRecord = await this.prisma.imports.findUnique({
      where: { id: findImportByIdInput.id },
    });
    return importRecord ? this.importMapper.toDomain(importRecord) : null;
  }
}
