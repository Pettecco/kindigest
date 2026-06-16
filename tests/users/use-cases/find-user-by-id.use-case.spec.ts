import { FindUserByIdUseCase, FindUserByIdInput } from '../../../src/users/use-cases/find-user-by-id.use-case';
import { IUsersRepository } from '../../../src/users/domain/user-repository';
import { NotFoundException } from '@nestjs/common';
import { PreferredDisplayMode } from '../../../generated/prisma/enums';

class MockUserRepository implements IUsersRepository {
  private users: any[] = [
    {
      id: 'valid-id-123',
      email: 'test@example.com',
      passwordHash: 'hashedPassword123',
      hashedRefreshToken: 'refreshToken123',
      preferredDisplayMode: PreferredDisplayMode.TRANSLATED,
      createdAt: new Date('2024-01-01'),
    },
  ];

  async create(userData: { email: string; password: string }): Promise<any> {
    throw new Error('Not implemented');
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

describe('FindUserByIdUseCase', () => {
  let useCase: FindUserByIdUseCase;
  let userRepository: MockUserRepository;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    useCase = new FindUserByIdUseCase(userRepository);
  });

  it('should find user by id successfully', async () => {
    const input: FindUserByIdInput = { id: 'valid-id-123' };

    const result = await useCase.execute(input);

    expect(result.id).toBe('valid-id-123');
    expect(result.email).toBe('test@example.com');
    expect(result.preferredDisplayMode).toBe(PreferredDisplayMode.TRANSLATED);
    expect(result.createdAt).toEqual(new Date('2024-01-01'));
  });

  it('should exclude sensitive fields from output', async () => {
    const input: FindUserByIdInput = { id: 'valid-id-123' };

    const result = await useCase.execute(input);

    expect(result).not.toHaveProperty('passwordHash');
    expect(result).not.toHaveProperty('hashedRefreshToken');
  });

  it('should throw NotFoundException when user not found', async () => {
    const input: FindUserByIdInput = { id: 'non-existent-id' };

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(input)).rejects.toThrow('User not found');
  });

  it('should throw NotFoundException with correct status', async () => {
    const input: FindUserByIdInput = { id: 'non-existent-id' };

    try {
      await useCase.execute(input);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.getStatus()).toBe(404);
    }
  });
});
