import { UserFactory } from '../../../src/users/domain/user.factory';
import { PreferredDisplayMode } from '../../../generated/prisma/enums';

describe('UserFactory - Validation Errors', () => {
  it('should throw error for invalid email', () => {
    expect(() => {
      UserFactory.create({
        email: 'invalid-email',
        passwordHash: 'hashedPassword123',
      });
    }).toThrow('Invalid email');
  });

  it('should throw error for empty email', () => {
    expect(() => {
      UserFactory.create({
        email: '',
        passwordHash: 'hashedPassword123',
      });
    }).toThrow('Invalid email');
  });

  it('should throw error for null email', () => {
    expect(() => {
      UserFactory.create({
        email: null as any,
        passwordHash: 'hashedPassword123',
      });
    }).toThrow('Invalid email');
  });

  it('should throw error for short password hash', () => {
    expect(() => {
      UserFactory.create({
        email: 'test@example.com',
        passwordHash: 'short',
      });
    }).toThrow('Password hash must be at least 10 characters');
  });

  it('should throw error for empty password hash', () => {
    expect(() => {
      UserFactory.create({
        email: 'test@example.com',
        passwordHash: '',
      });
    }).toThrow('Password hash must be at least 10 characters');
  });

  it('should throw error for invalid display mode', () => {
    expect(() => {
      UserFactory.create({
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        preferredDisplayMode: 'INVALID' as any,
      });
    }).toThrow('Invalid display mode');
  });
});
