import { PreferredDisplayMode } from '../../../generated/prisma/enums';
import { UserBuilder } from '../../__builders__/user.builder';

describe('User', () => {
  it('should create a valid user via builder', () => {
    const user = UserBuilder.create()
      .withEmail('test@example.com')
      .withPasswordHash('hashedPassword123')
      .build();

    expect(user.email).toBe('test@example.com');
    expect(user.passwordHash).toBe('hashedPassword123');
    expect(user.preferredDisplayMode).toBe(PreferredDisplayMode.TRANSLATED);
    expect(user.hashedRefreshToken).toBeNull();
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeDefined();
  });

  it('should create user with default display mode', () => {
    const user = UserBuilder.create()
      .withEmail('test@example.com')
      .withPasswordHash('hashedPassword123')
      .build();

    expect(user.preferredDisplayMode).toBe(PreferredDisplayMode.TRANSLATED);
  });

  it('should create user with custom id', () => {
    const customId = 'custom-id-123';
    const user = UserBuilder.create()
      .withId(customId)
      .withEmail('test@example.com')
      .withPasswordHash('hashedPassword123')
      .build();

    expect(user.id).toBe(customId);
  });

  it('should create user with refresh token', () => {
    const user = UserBuilder.create()
      .withEmail('test@example.com')
      .withPasswordHash('hashedPassword123')
      .withRefreshToken('refreshToken123')
      .build();

    expect(user.hashedRefreshToken).toBe('refreshToken123');
  });

  it('should create user with custom dates', () => {
    const customDate = new Date('2024-01-01');
    const user = UserBuilder.create()
      .withEmail('test@example.com')
      .withPasswordHash('hashedPassword123')
      .withCreatedAt(customDate)
      .build();

    expect(user.createdAt).toBe(customDate);
  });

  it('should create user with immersive display mode', () => {
    const user = UserBuilder.create()
      .withEmail('builder@example.com')
      .withPasswordHash('hashed123')
      .withDisplayMode(PreferredDisplayMode.IMMERSIVE)
      .build();

    expect(user.email).toBe('builder@example.com');
    expect(user.preferredDisplayMode).toBe(PreferredDisplayMode.IMMERSIVE);
  });
});
