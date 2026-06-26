import {
  UpdatePreferredDisplayModeUseCase,
  UpdatePreferredDisplayModeInput,
} from '../../../src/users/use-cases/update-preferred-display-mode.use-case';
import { MockUserRepository } from '../../__mocks__/user-repository.mock';
import { MockLogger } from '../../__mocks__/logger.mock';
import { UserBuilder } from '../../__builders__/user.builder';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PreferredDisplayMode } from '../../../generated/prisma/enums';

describe('UpdatePreferredDisplayModeUseCase', () => {
  let useCase: UpdatePreferredDisplayModeUseCase;
  let userRepository: MockUserRepository;
  let logger: MockLogger;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    logger = new MockLogger();
    useCase = new UpdatePreferredDisplayModeUseCase(
      userRepository as any,
      logger,
    );
  });

  it('should update preferred display mode successfully', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .withDisplayMode(PreferredDisplayMode.TRANSLATED)
      .build();

    userRepository.addUser(user);

    const input: UpdatePreferredDisplayModeInput = {
      userId: 'user-123',
      requesterId: 'user-123',
      preferredDisplayMode: PreferredDisplayMode.IMMERSIVE,
    };

    const result = await useCase.execute(input);

    expect(result.preferredDisplayMode).toBe(PreferredDisplayMode.IMMERSIVE);
    expect(result.id).toBe('user-123');
    expect(result.email).toBe('test@example.com');
  });

  it('should exclude sensitive fields from output', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .withPasswordHash('sensitiveHash123')
      .withRefreshToken('sensitiveToken123')
      .build();

    userRepository.addUser(user);

    const input: UpdatePreferredDisplayModeInput = {
      userId: 'user-123',
      requesterId: 'user-123',
      preferredDisplayMode: PreferredDisplayMode.IMMERSIVE,
    };

    const result = await useCase.execute(input);

    expect(result).not.toHaveProperty('passwordHash');
    expect(result).not.toHaveProperty('hashedRefreshToken');
  });

  it('should throw ForbiddenException when requester is not the user', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .build();

    userRepository.addUser(user);

    const input: UpdatePreferredDisplayModeInput = {
      userId: 'user-123',
      requesterId: 'different-user-456',
      preferredDisplayMode: PreferredDisplayMode.IMMERSIVE,
    };

    await expect(useCase.execute(input)).rejects.toThrow(ForbiddenException);
    await expect(useCase.execute(input)).rejects.toThrow(
      'User does not have permission',
    );
  });

  it('should throw ForbiddenException with correct status', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .build();

    userRepository.addUser(user);

    const input: UpdatePreferredDisplayModeInput = {
      userId: 'user-123',
      requesterId: 'different-user-456',
      preferredDisplayMode: PreferredDisplayMode.IMMERSIVE,
    };

    try {
      await useCase.execute(input);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
      expect((error as ForbiddenException).getStatus()).toBe(403);
    }
  });

  it('should throw NotFoundException when user not found', async () => {
    const input: UpdatePreferredDisplayModeInput = {
      userId: 'non-existent-id',
      requesterId: 'non-existent-id',
      preferredDisplayMode: PreferredDisplayMode.IMMERSIVE,
    };

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(input)).rejects.toThrow('User not found');
  });

  it('should call logger.info when updating', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .build();

    userRepository.addUser(user);

    const input: UpdatePreferredDisplayModeInput = {
      userId: 'user-123',
      requesterId: 'user-123',
      preferredDisplayMode: PreferredDisplayMode.IMMERSIVE,
    };

    const loggerInfoSpy = jest.spyOn(logger, 'info');

    await useCase.execute(input);

    expect(loggerInfoSpy).toHaveBeenCalledWith(
      'Updating preferred display mode',
    );
  });

  it('should update from TRANSLATED to IMMERSIVE', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .withDisplayMode(PreferredDisplayMode.TRANSLATED)
      .build();

    userRepository.addUser(user);

    const input: UpdatePreferredDisplayModeInput = {
      userId: 'user-123',
      requesterId: 'user-123',
      preferredDisplayMode: PreferredDisplayMode.IMMERSIVE,
    };

    const result = await useCase.execute(input);

    expect(result.preferredDisplayMode).toBe(PreferredDisplayMode.IMMERSIVE);
  });

  it('should update from IMMERSIVE to TRANSLATED', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .withDisplayMode(PreferredDisplayMode.IMMERSIVE)
      .build();

    userRepository.addUser(user);

    const input: UpdatePreferredDisplayModeInput = {
      userId: 'user-123',
      requesterId: 'user-123',
      preferredDisplayMode: PreferredDisplayMode.TRANSLATED,
    };

    const result = await useCase.execute(input);

    expect(result.preferredDisplayMode).toBe(PreferredDisplayMode.TRANSLATED);
  });
});
