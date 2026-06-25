import { Import } from '../entities';

export interface CreateImportInput {
  userId: string;
}

export interface FindImportByIdInput {
  id: string;
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
}
