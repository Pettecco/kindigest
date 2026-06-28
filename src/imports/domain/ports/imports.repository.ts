import { ImportStatus } from 'generated/prisma/client';
import { Import } from '../entities';

export interface CreateImportInput {
  userId: string;
  originalFileName: string;
  status?: ImportStatus;
}

export interface FindImportByIdInput {
  id: string;
}

export interface UpdateImportInput {
  id: string;
  status?: ImportStatus;
  startedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  errorMessage?: string;
}

export const IImportsRepository = Symbol('IImportsRepository');

export interface IImportsRepository {
  /**
   * Persists a new Import entity in the database.
   * @param createImportInput The input containing the user ID.
   * @returns A promise that resolves with the created Import entity.
   */
  create(createImportInput: CreateImportInput): Promise<Import>;

  /**
   * Finds an import by its unique identifier.
   * @param findImportByIdInput The input containing the import UUID.
   * @returns A promise that resolves with the Import entity or null if not found.
   */
  findById(findImportByIdInput: FindImportByIdInput): Promise<Import | null>;

  /**
   * Updates an existing Import entity with partial data.
   * @param input The input containing the import ID and optional fields to update.
   * @returns A promise that resolves with the updated Import entity.
   */
  update(input: UpdateImportInput): Promise<Import>;
}
