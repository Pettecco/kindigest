import { Import } from '../entities';

export const IImportsRepository = Symbol('IImportsRepository');

export interface IImportsRepository {
  create(userId: string): Promise<Import>;
  findById(id: string): Promise<Import | null>;
}
