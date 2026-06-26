import {
  FindUserByEmailUseCase,
  FindUserByEmailInput,
} from '../../../src/users/use-cases/find-user-by-email.use-case';
import { MockUserRepository } from '../../__mocks__/user-repository.mock';
import { UserBuilder } from '../../__builders__/user.builder';
import { NotFoundException } from '@nestjs/common';
import { PreferredDisplayMode } from '../../../generated/prisma/enums';

describe('FindUserByEmailUseCase', () => {
  let useCase: FindUserByEmailUseCase;
  let userRepository: MockUserRepository;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    useCase = new FindUserByEmailUseCase(userRepository as any);
  });

  it('should find user by email successfully', async () => {
    const existingUser = UserBuilder.create()
      .withId('valid-id-123')
      .withEmail('test@example.com')
      .build();

    userRepository.addUser(existingUser);

    const input: FindUserByEmailInput = { email: 'test@example.com' };

    const result = await useCase.execute(input);

    expect(result.id).toBe('valid-id-123');
    expect(result.email).toBe('test@example.com');
    expect(result.preferredDisplayMode).toBe(PreferredDisplayMode.TRANSLATED);
    expect(result.createdAt).toEqual(new Date('2024-01-01'));
  });

  it('should exclude sensitive fields from output', async () => {
    const existingUser = UserBuilder.create()
      .withId('valid-id-123')
      .withEmail('test@example.com')
      .withPasswordHash('sensitiveHash123')
      .withRefreshToken('sensitiveToken123')
      .build();

    userRepository.addUser(existingUser);

    const input: FindUserByEmailInput = { email: 'test@example.com' };

    const result = await useCase.execute(input);

    expect(result).not.toHaveProperty('passwordHash');
    expect(result).not.toHaveProperty('hashedRefreshToken');
  });

  it('should throw NotFoundException when user not found', async () => {
    const input: FindUserByEmailInput = { email: 'nonexistent@example.com' };

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(input)).rejects.toThrow('User not found');
  });

  it('should throw NotFoundException with correct status', async () => {
    const input: FindUserByEmailInput = { email: 'nonexistent@example.com' };

    try {
      await useCase.execute(input);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect((error as NotFoundException).getStatus()).toBe(404);
    }
  });

  it('should return user with IMMERSIVE display mode', async () => {
    const existingUser = UserBuilder.create()
      .withId('immersive-user-id')
      .withEmail('immersive@example.com')
      .withDisplayMode(PreferredDisplayMode.IMMERSIVE)
      .build();

    userRepository.addUser(existingUser);

    const input: FindUserByEmailInput = { email: 'immersive@example.com' };

    const result = await useCase.execute(input);

    expect(result.preferredDisplayMode).toBe(PreferredDisplayMode.IMMERSIVE);
  });

  it('should find user with custom refresh token', async () => {
    const existingUser = UserBuilder.create()
      .withId('user-with-token')
      .withEmail('user@example.com')
      .withRefreshToken('myRefreshToken123')
      .build();

    userRepository.addUser(existingUser);

    const input: FindUserByEmailInput = { email: 'user@example.com' };

    const result = await useCase.execute(input);

    expect(result.id).toBe('user-with-token');
    expect(result.email).toBe('user@example.com');
  });
});
