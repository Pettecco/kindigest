import { IHashingService } from '../../src/auth/hashing/hashing.service';

export class MockHashingService implements IHashingService {
  private hashPrefix: string = 'hashed_';

  withHashPrefix(prefix: string): MockHashingService {
    this.hashPrefix = prefix;
    return this;
  }

  async hash(password: string): Promise<string> {
    return `${this.hashPrefix}${password}`;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return `${this.hashPrefix}${password}` === hash;
  }
}
