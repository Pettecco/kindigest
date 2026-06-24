import { User } from '../entities';
import { PreferredDisplayMode } from 'generated/prisma/enums';

export const IUsersRepository = Symbol('IUsersRepository');

export interface IUsersRepository {
  create(data: { email: string; password: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updatePreferredDisplayMode(
    id: string,
    mode: PreferredDisplayMode,
  ): Promise<User>;
  updateRefreshToken(id: string, token: string | null): Promise<void>;
}
