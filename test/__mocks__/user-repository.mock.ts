import { IUsersRepository, User } from 'src/users/domain';

export class MockUserRepository implements IUsersRepository {
  private users: User[] = [];

  async create(userData: { email: string; password: string }): Promise<User> {
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    const user: User = {
      id: 'user-id-123',
      email: userData.email,
      passwordHash: userData.password,
      hashedRefreshToken: null,
      preferredDisplayMode: 'TRANSLATED' as any,
      createdAt: new Date(),
    };
    await this.users.push(user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return (await this.users.find(u => u.id === id)) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return (await this.users.find(u => u.email === email)) || null;
  }

  async updateRefreshToken(id: string, token: string | null): Promise<void> {
    const user = await this.users.find(u => u.id === id);
    if (user) {
      user.hashedRefreshToken = token;
    }
  }

  async updatePreferredDisplayMode(
    id: string,
    mode: 'TRANSLATED' | 'IMMERSIVE',
  ): Promise<User> {
    const user = await this.users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    user.preferredDisplayMode = mode as any;
    return user;
  }

  addUser(user: User): void {
    this.users.push(user);
  }

  clear(): void {
    this.users = [];
  }
}
