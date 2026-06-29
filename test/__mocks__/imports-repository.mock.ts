import {
  IImportsRepository,
  CreateImportInput,
  FindImportByIdInput,
  UpdateImportInput,
} from '../../src/imports/domain/ports/imports.repository';
import { Import } from '../../src/imports/domain/entities/import';
import { ImportStatus } from '../../generated/prisma/enums';

export class MockImportsRepository implements IImportsRepository {
  private imports: Import[] = [];

  async create(input: CreateImportInput): Promise<Import> {
    const importRecord: Import = {
      id: 'import-id-123',
      userId: input.userId,
      originalFileName: input.originalFileName,
      status: input.status ?? ImportStatus.PENDING,
      createdAt: new Date(),
      startedAt: null,
      completedAt: null,
      failedAt: null,
      errorMessage: null,
    };
    this.imports.push(importRecord);
    return importRecord;
  }

  async findById(input: FindImportByIdInput): Promise<Import | null> {
    return this.imports.find((i) => i.id === input.id) ?? null;
  }

  async update(input: UpdateImportInput): Promise<Import> {
    const index = this.imports.findIndex((i) => i.id === input.id);
    if (index === -1) throw new Error('Import not found');

    this.imports[index] = { ...this.imports[index], ...input };
    return this.imports[index];
  }

  clear(): void {
    this.imports = [];
  }
}
