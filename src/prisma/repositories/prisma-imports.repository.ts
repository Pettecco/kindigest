import { Injectable } from '@nestjs/common';
import {
  IImportsRepository,
  CreateImportInput,
  FindImportByIdInput,
} from '../../imports/domain/ports/imports.repository';
import { Import } from '../../imports/domain/entities/import';
import { PrismaService } from '../prisma.service';
import { ImportMapper } from '../mappers/import.mapper';

@Injectable()
export class PrismaImportsRepository implements IImportsRepository {
  constructor(
    private prisma: PrismaService,
    private importMapper: ImportMapper,
  ) {}

  async create({
    userId,
    originalFileName,
    status,
  }: CreateImportInput): Promise<Import> {
    const importRecord = await this.prisma.imports.create({
      data: { userId, originalFileName, status },
    });

    return this.importMapper.toDomain(importRecord);
  }

  async findById(
    findImportByIdInput: FindImportByIdInput,
  ): Promise<Import | null> {
    const importRecord = await this.prisma.imports.findUnique({
      where: { id: findImportByIdInput.id },
    });
    return importRecord ? this.importMapper.toDomain(importRecord) : null;
  }
}
