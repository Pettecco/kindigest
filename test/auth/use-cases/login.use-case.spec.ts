import { LoginUseCase } from '../../../src/auth/use-cases/login.use-case';
import { MockUserRepository } from '../../__mocks__/user-repository.mock';
import { UserBuilder } from '../../__builders__/user.builder';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IHashingService } from '../../../src/auth/hashing/hashing.service';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let userRepository: MockUserRepository;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockHashingService: jest.Mocked<IHashingService>;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockLogger: jest.Mocked<any>;

  beforeEach(() => {
    userRepository = new MockUserRepository();

    mockJwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    } as any;

    mockHashingService = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as any;

    mockConfigService = {
      get: jest.fn(),
    } as any;

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    useCase = new LoginUseCase(
      userRepository,
      mockHashingService,
      mockJwtService,
      mockConfigService,
      mockLogger,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully and return tokens', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .withPasswordHash('hashedPassword123')
      .build();

    userRepository.addUser(user);

    mockHashingService.compare.mockResolvedValue(true);
    mockConfigService.get.mockImplementation((key: string) => {
      const config: Record<string, any> = {
        JWT_TOKEN_AUDIENCE: 'test-audience',
        JWT_TOKEN_ISSUER: 'test-issuer',
        JWT_SECRET: 'test-secret',
        JWT_TTL: 3600,
        JWT_REFRESH_TTL: 86400,
      };
      return config[key];
    });
    mockJwtService.signAsync.mockImplementation(
      async () => await 'mocked-token',
    );
    mockHashingService.hash.mockResolvedValue('hashedRefreshToken');

    const result = await useCase.execute('test@example.com', 'password123');

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Login successful: test@example.com',
    );
    const updatedUser = await userRepository.findById('user-123');
    expect(updatedUser?.hashedRefreshToken).toBe('hashedRefreshToken');
  });

  it('should throw UnauthorizedException when user not found', async () => {
    mockHashingService.compare.mockResolvedValue(false);

    await expect(
      useCase.execute('nonexistent@example.com', 'password123'),
    ).rejects.toThrow(UnauthorizedException);

    await expect(
      useCase.execute('nonexistent@example.com', 'password123'),
    ).rejects.toThrow('Invalid credentials');
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .withPasswordHash('hashedPassword123')
      .build();

    userRepository.addUser(user);

    mockHashingService.compare.mockResolvedValue(false);

    await expect(
      useCase.execute('test@example.com', 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException);

    await expect(
      useCase.execute('test@example.com', 'wrongpassword'),
    ).rejects.toThrow('Invalid credentials');
  });

  it('should call hashingService.compare with correct arguments', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .withPasswordHash('hashedPassword123')
      .build();

    userRepository.addUser(user);

    mockHashingService.compare.mockResolvedValue(true);
    mockConfigService.get.mockImplementation((key: string) => {
      const config: Record<string, any> = {
        JWT_TOKEN_AUDIENCE: 'test-audience',
        JWT_TOKEN_ISSUER: 'test-issuer',
        JWT_SECRET: 'test-secret',
        JWT_TTL: 3600,
        JWT_REFRESH_TTL: 86400,
      };
      return config[key];
    });
    mockJwtService.signAsync.mockImplementation(
      async () => await 'mocked-token',
    );
    mockHashingService.hash.mockResolvedValue('hashedRefreshToken');

    await useCase.execute('test@example.com', 'password123');

    expect(mockHashingService.compare).toHaveBeenCalledWith(
      'password123',
      'hashedPassword123',
    );
  });

  it('should update refresh token in repository', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .withPasswordHash('hashedPassword123')
      .build();

    userRepository.addUser(user);

    mockHashingService.compare.mockResolvedValue(true);
    mockConfigService.get.mockImplementation((key: string) => {
      const config: Record<string, any> = {
        JWT_TOKEN_AUDIENCE: 'test-audience',
        JWT_TOKEN_ISSUER: 'test-issuer',
        JWT_SECRET: 'test-secret',
        JWT_TTL: 3600,
        JWT_REFRESH_TTL: 86400,
      };
      return config[key];
    });
    mockJwtService.signAsync.mockImplementation(
      async () => await 'mocked-token',
    );
    mockHashingService.hash.mockResolvedValue('hashedRefreshToken');

    await useCase.execute('test@example.com', 'password123');

    expect(mockHashingService.hash).toHaveBeenCalled();
    expect(userRepository.findById('user-123')).toBeDefined();
  });
});
