import { User } from './user.js';
import { CreateUserDto } from '../dto/create-user.dto.js';

export interface IUsersRepository {
  create(user: CreateUserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}

export const IUsersRepository = Symbol('IUsersRepository');
