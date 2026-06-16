import { CreateUserUseCase, CreateUserInput } from '../../../src/users/use-cases/create-user.use-case';
import { IUsersRepository } from '../../../src/users/domain/user-repository';
import { IHashingService, IHashingServiceSymbol } from '../../../src/auth/hashing/hashing.service';
import { PreferredDisplayMode } from '../../../generated/prisma/enums';
import { ILogger } from '../../../src/common/interfaces/logger';

class MockUserRepository implements IUsersRepository {
  private users: any[] = [];

  async create(userData: { email: string; password: string }): Promise<any> {
    if (this.users.find((u) => u.email === userData.email)) {
      throw new Error('Email already in use');
    }
    const user = {
      id: 'user-id-123',
      email: userData.email,
      passwordHash: userData.password,
      hashedRefreshToken: null,
      preferredDisplayMode: PreferredDisplayMode.TRANSLATED,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async findById(id: string): Promise<any | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async findByEmail(email: string): Promise<any | null> {
    return this.users.find((u) => u.email === email) || null;
  }

  async updateRefreshToken(id: string, token: string | null): Promise<void> {
    // Mock implementation
  }
}

class MockHashingService implements IHashingService {
  async hash(password: string): Promise<string> {
    return `hashed_${password}`;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return `hashed_${password}` === hash;
  }
}

class MockLogger implements ILogger {
  async info(message: string): Promise<void> {}
  async warn(message: string): Promise<void> {}
  async error(message: string): Promise<void> {}
  async debug(message: string): Promise<void> {}
}

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
});
