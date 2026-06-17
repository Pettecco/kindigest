import { PreferredDisplayMode } from '../../../generated/prisma/client';
import { User } from './user';

interface CreateUserProps {
  id?: string;
  email: string;
  passwordHash: string;
  hashedRefreshToken?: string | null;
  preferredDisplayMode?: PreferredDisplayMode;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserFactory {
  static create(props: CreateUserProps): User {
    this.validateEmail(props.email);
    this.validatePasswordHash(props.passwordHash);
    this.validateDisplayMode(props.preferredDisplayMode);

    return {
      id: props.id ?? this.generateId(),
      email: props.email,
      passwordHash: props.passwordHash,
      hashedRefreshToken: props.hashedRefreshToken ?? null,
      preferredDisplayMode:
        props.preferredDisplayMode ?? PreferredDisplayMode.TRANSLATED,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  private static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('Invalid email');
    }
  }

  private static validatePasswordHash(passwordHash: string): void {
    if (!passwordHash || passwordHash.length < 10) {
      throw new Error('Password hash must be at least 10 characters');
    }
  }

  private static validateDisplayMode(mode?: PreferredDisplayMode): void {
    if (mode && !Object.values(PreferredDisplayMode).includes(mode)) {
      throw new Error('Invalid display mode');
    }
  }

  private static generateId(): string {
    return crypto.randomUUID();
  }
}
