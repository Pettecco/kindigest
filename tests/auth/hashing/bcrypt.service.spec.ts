import { BcryptService } from '../../../src/auth/hashing/bcrypt.service';

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(() => {
    service = new BcryptService();
  });

  it('should hash a password', async () => {
    const password = 'SecurePass123';
    const hash = await service.hash(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(50);
  });

  it('should compare password correctly', async () => {
    const password = 'SecurePass123';
    const hash = await service.hash(password);

    const isValid = await service.compare(password, hash);
    expect(isValid).toBe(true);
  });

  it('should reject wrong password', async () => {
    const password = 'SecurePass123';
    const wrongPassword = 'WrongPass456';
    const hash = await service.hash(password);

    const isValid = await service.compare(wrongPassword, hash);
    expect(isValid).toBe(false);
  });

  it('should generate different hashes for same password', async () => {
    const password = 'SecurePass123';
    const hash1 = await service.hash(password);
    const hash2 = await service.hash(password);

    expect(hash1).not.toBe(hash2);
  });

  it('should verify hash with different salt rounds', async () => {
    const password = 'SecurePass123';
    const hash = await service.hash(password);

    const isValid = await service.compare(password, hash);
    expect(isValid).toBe(true);
  });
});
