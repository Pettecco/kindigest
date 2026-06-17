import { PreferredDisplayMode } from 'generated/prisma/enums';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from './user';

export interface IUsersRepository {
  create(user: CreateUserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updatePreferredDisplayMode(
    id: string,
    mode: PreferredDisplayMode,
  ): Promise<User>;
  updateRefreshToken(id: string, token: string | null): Promise<void>;
}

export const IUsersRepository = Symbol('IUsersRepository');
