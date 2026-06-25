import { User } from '../entities';
import { PreferredDisplayMode } from 'generated/prisma/enums';
import { CreateUserDto } from '../../../users/dto/create-user.dto';
import { UpdatePreferredDisplayModeBodyDto } from '../../../users/dto/update-preferred-display-mode.dto';

export const IUsersRepository = Symbol('IUsersRepository');

export interface IUsersRepository {
  /**
   * Persists a new User entity in the database.
   * @param createUserDto The user creation data containing email and password.
   * @returns A promise that resolves with the created User entity.
   */
  create(createUserDto: CreateUserDto): Promise<User>;

  /**
   * Finds a user by their email address.
   * @param email The user's email address.
   * @returns A promise that resolves with the User entity or null if not found.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Finds a user by their unique identifier.
   * @param id The user UUID.
   * @returns A promise that resolves with the User entity or null if not found.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Updates a user's preferred display mode and returns the updated entity.
   * @param id The user UUID.
   * @param preferredDisplayMode the preferred display mode.
   * @returns A promise that resolves with the updated User entity.
   */
  updatePreferredDisplayMode(
    id: string,
    preferredDisplayMode: PreferredDisplayMode,
  ): Promise<User>;

  /**
   * Updates or clears the refresh token for a user.
   * @param id The user UUID.
   * @param token The refresh token to set, or null to clear it.
   * @returns A promise that resolves when the update is complete.
   */
  updateRefreshToken(id: string, token: string | null): Promise<void>;
}
