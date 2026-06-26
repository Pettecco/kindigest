import { RefreshTokenUseCase } from '../../../src/auth/use-cases/refresh-token.use-case';
import { MockUserRepository } from '../../__mocks__/user-repository.mock';
import { UserBuilder } from '../../__builders__/user.builder';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IHashingService } from '../../../src/auth/hashing/hashing.service';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;
  let userRepository: MockUserRepository;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockHashingService: jest.Mocked<IHashingService>;
  let mockConfigService: jest.Mocked<ConfigService>;

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

    useCase = new RefreshTokenUseCase(
      mockJwtService,
      userRepository,
      mockHashingService,
      mockConfigService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should refresh tokens successfully', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .withPasswordHash('hashedPassword123')
      .withRefreshToken('hashedRefreshToken123')
      .build();

    userRepository.addUser(user);

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

    mockJwtService.verifyAsync.mockResolvedValue({} as any);
    mockHashingService.compare.mockResolvedValue(true);
    mockJwtService.signAsync.mockImplementation(async () => await 'new-token');
    mockHashingService.hash.mockResolvedValue('newHashedRefreshToken');

    const result = await useCase.execute('user-123', 'validRefreshToken');

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(
      'validRefreshToken',
      {
        secret: 'test-secret',
        audience: 'test-audience',
        issuer: 'test-issuer',
      },
    );
  });

  it('should throw UnauthorizedException when user not found', async () => {
    await expect(
      useCase.execute('non-existent-id', 'refreshToken'),
    ).rejects.toThrow(UnauthorizedException);

    await expect(
      useCase.execute('non-existent-id', 'refreshToken'),
    ).rejects.toThrow('User not found');
  });

  it('should throw UnauthorizedException when refresh token not stored', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .build();

    userRepository.addUser(user);

    await expect(useCase.execute('user-123', 'refreshToken')).rejects.toThrow(
      UnauthorizedException,
    );

    await expect(useCase.execute('user-123', 'refreshToken')).rejects.toThrow(
      'Refresh token not found',
    );
  });

  it('should throw UnauthorizedException when jwt verification fails', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .withRefreshToken('hashedRefreshToken123')
      .build();

    userRepository.addUser(user);

    mockJwtService.verifyAsync.mockRejectedValue(
      new UnauthorizedException('Token expired'),
    );

    await expect(
      useCase.execute('user-123', 'expiredRefreshToken'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when refresh token does not match hash', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .withRefreshToken('storedHashedToken')
      .build();

    userRepository.addUser(user);

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

    mockJwtService.verifyAsync.mockResolvedValue({} as any);
    mockHashingService.compare.mockResolvedValue(false);

    await expect(
      useCase.execute('user-123', 'wrongRefreshToken'),
    ).rejects.toThrow(UnauthorizedException);

    await expect(
      useCase.execute('user-123', 'wrongRefreshToken'),
    ).rejects.toThrow('Refresh token invalid');
  });

  it('should update refresh token in repository', async () => {
    const user = UserBuilder.create()
      .withId('user-123')
      .withEmail('test@example.com')
      .withRefreshToken('oldHashedToken')
      .build();

    userRepository.addUser(user);

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

    mockJwtService.verifyAsync.mockResolvedValue({} as any);
    mockHashingService.compare.mockResolvedValue(true);
    mockJwtService.signAsync.mockImplementation(async () => await 'new-token');
    mockHashingService.hash.mockResolvedValue('newHashedRefreshToken');

    await useCase.execute('user-123', 'validRefreshToken');

    expect(mockHashingService.hash).toHaveBeenCalledWith('new-token');
    const updatedUser = await userRepository.findById('user-123');
    expect(updatedUser?.hashedRefreshToken).toBe('newHashedRefreshToken');
  });
});
