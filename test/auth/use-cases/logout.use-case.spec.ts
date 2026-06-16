import { LogoutUseCase } from '../../../src/auth/use-cases/logout.use-case';
import { MockUserRepository } from '../../__mocks__/user-repository.mock';
import { UserBuilder } from '../../__builders__/user.builder';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
  let userRepository: MockUserRepository;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    useCase = new LogoutUseCase(userRepository);
  });

  it('should clear refresh token for user', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .withRefreshToken('existing-refresh-token')
      .build();

    userRepository.addUser(user);

    await useCase.execute('user-123');

    const updatedUser = await userRepository.findById('user-123');
    expect(updatedUser?.hashedRefreshToken).toBeNull();
  });

  it('should handle logout for user without refresh token', async () => {
    const user = UserBuilder.create()
      .withId('user-456')
      .withEmail('test@example.com')
      .build();

    userRepository.addUser(user);

    await expect(useCase.execute('user-456')).resolves.not.toThrow();

    const updatedUser = await userRepository.findById('user-456');
    expect(updatedUser?.hashedRefreshToken).toBeNull();
  });

  it('should not throw when user does not exist', async () => {
    await expect(useCase.execute('non-existent-id')).resolves.not.toThrow();
  });
});
