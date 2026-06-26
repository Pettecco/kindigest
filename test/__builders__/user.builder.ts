import { PreferredDisplayMode } from '../../generated/prisma/enums';
import { User } from 'src/users/domain';

export class UserBuilder {
  private id: string = 'user-id-123';
  private email: string = 'test@example.com';
  private passwordHash: string = 'hashedPassword123';
  private hashedRefreshToken: string | null = null;
  private preferredDisplayMode: PreferredDisplayMode =
    PreferredDisplayMode.TRANSLATED;
  private createdAt: Date = new Date('2024-01-01');

  withId(id: string): UserBuilder {
    this.id = id;
    return this;
  }

  withEmail(email: string): UserBuilder {
    this.email = email;
    return this;
  }

  withPasswordHash(passwordHash: string): UserBuilder {
    this.passwordHash = passwordHash;
    return this;
  }

  withRefreshToken(token: string | null): UserBuilder {
    this.hashedRefreshToken = token;
    return this;
  }

  withDisplayMode(mode: PreferredDisplayMode): UserBuilder {
    this.preferredDisplayMode = mode;
    return this;
  }

  withCreatedAt(date: Date): UserBuilder {
    this.createdAt = date;
    return this;
  }

  build(): User {
    return {
      id: this.id,
      email: this.email,
      passwordHash: this.passwordHash,
      hashedRefreshToken: this.hashedRefreshToken,
      preferredDisplayMode: this.preferredDisplayMode,
      createdAt: this.createdAt,
    };
  }

  static create(): UserBuilder {
    return new UserBuilder();
  }
}
