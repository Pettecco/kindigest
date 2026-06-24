import { UserFactory } from '../../../src/common/domain/user.factory';
import { PreferredDisplayMode } from '../../../generated/prisma/enums';
import { UserBuilder } from '../../__builders__/user.builder';

describe('UserFactory', () => {
  it('should create a valid user', () => {
    const user = UserFactory.create({
      email: 'test@example.com',
      passwordHash: 'hashedPassword123',
    });

    expect(user.email).toBe('test@example.com');
    expect(user.passwordHash).toBe('hashedPassword123');
    expect(user.preferredDisplayMode).toBe(PreferredDisplayMode.TRANSLATED);
    expect(user.hashedRefreshToken).toBeNull();
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeDefined();
  });

  it('should create user with default display mode', () => {
    const user = UserFactory.create({
      email: 'test@example.com',
      passwordHash: 'hashedPassword123',
    });

    expect(user.preferredDisplayMode).toBe(PreferredDisplayMode.TRANSLATED);
  });

  it('should create user with custom id', () => {
    const customId = 'custom-id-123';
    const user = UserFactory.create({
      id: customId,
      email: 'test@example.com',
      passwordHash: 'hashedPassword123',
    });

    expect(user.id).toBe(customId);
  });

  it('should create user with refresh token', () => {
    const user = UserFactory.create({
      email: 'test@example.com',
      passwordHash: 'hashedPassword123',
      hashedRefreshToken: 'refreshToken123',
    });

    expect(user.hashedRefreshToken).toBe('refreshToken123');
  });

  it('should create user with custom dates', () => {
    const customDate = new Date('2024-01-01');
    const user = UserFactory.create({
      email: 'test@example.com',
      passwordHash: 'hashedPassword123',
      createdAt: customDate,
    });

    expect(user.createdAt).toBe(customDate);
  });

  it('should create user using builder pattern', () => {
    const user = UserBuilder.create()
      .withEmail('builder@example.com')
      .withPasswordHash('hashed123')
      .withDisplayMode(PreferredDisplayMode.IMMERSIVE)
      .build();

    expect(user.email).toBe('builder@example.com');
    expect(user.preferredDisplayMode).toBe(PreferredDisplayMode.IMMERSIVE);
  });
});
