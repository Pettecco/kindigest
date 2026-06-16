import { CreateUserUseCase, CreateUserInput } from '../../../src/users/use-cases/create-user.use-case';
import { MockUserRepository } from '../../__mocks__/user-repository.mock';
import { MockHashingService } from '../../__mocks__/hashing-service.mock';
import { MockLogger } from '../../__mocks__/logger.mock';
import { PreferredDisplayMode } from '../../../generated/prisma/enums';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: MockUserRepository;
  let hashingService: MockHashingService;
  let logger: MockLogger;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    hashingService = new MockHashingService();
    logger = new MockLogger();
    useCase = new CreateUserUseCase(userRepository, hashingService, logger);
  });

  it('should create a user successfully', async () => {
    const input: CreateUserInput = {
      email: 'test@example.com',
      password: 'SecurePass123',
    };

    const result = await useCase.execute(input);

    expect(result.email).toBe(input.email);
    expect(result.preferredDisplayMode).toBe(PreferredDisplayMode.TRANSLATED);
    expect(result.id).toBeDefined();
  });

  it('should hash password before saving', async () => {
    const input: CreateUserInput = {
      email: 'new@example.com',
      password: 'MyPassword123',
    };

    const result = await useCase.execute(input);

    expect(result.id).toBe('user-id-123');
  });

  it('should throw ConflictException when email already exists', async () => {
    const input: CreateUserInput = {
      email: 'test@example.com',
      password: 'SecurePass123',
    };

    await useCase.execute(input);

    await expect(useCase.execute(input)).rejects.toThrow('Email already in use');
    await expect(useCase.execute(input)).rejects.toMatchObject({
      status: 409,
      name: 'ConflictException',
    });
  });

  it('should call repository methods in correct order', async () => {
    const input: CreateUserInput = {
      email: 'test@example.com',
      password: 'SecurePass123',
    };

    const findByEmailSpy = jest.spyOn(userRepository, 'findByEmail');
    const hashSpy = jest.spyOn(hashingService, 'hash');
    const createSpy = jest.spyOn(userRepository, 'create');

    await useCase.execute(input);

    expect(findByEmailSpy).toHaveBeenCalledWith(input.email);
    expect(hashSpy).toHaveBeenCalledWith(input.password);
    expect(createSpy).toHaveBeenCalledWith({
      email: input.email,
      password: 'hashed_SecurePass123',
    });
  });

  it('should create user with correct password hash', async () => {
    const input: CreateUserInput = {
      email: 'test@example.com',
      password: 'SecurePass123',
    };

    await useCase.execute(input);

    const user = await userRepository.findByEmail(input.email);
    expect(user?.passwordHash).toBe('hashed_SecurePass123');
  });

  it('should create user with default display mode TRANSLATED', async () => {
    const input: CreateUserInput = {
      email: 'test@example.com',
      password: 'SecurePass123',
    };

    const result = await useCase.execute(input);

    expect(result.preferredDisplayMode).toBe(PreferredDisplayMode.TRANSLATED);
  });
});
