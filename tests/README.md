# Tests

Unit and integration tests for Kindigest.

## Structure

```
tests/
├── jest-unit.json          # Jest config for unit tests
├── README.md               # This file
├── auth/                   # Auth module tests
│   ├── hashing/
│   └── use-cases/
└── users/                  # Users module tests
    ├── domain/
    └── use-cases/
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run with coverage
npm run test:unit:cov

# Run specific test file
npm run test:unit -- users/domain/user.spec.ts

# Run in watch mode
npm run test:unit:watch
```

### E2E Tests

```bash
# Run all e2e tests
npm run test:e2e
```

## Writing Tests

### Unit Test Example

```typescript
import { UserFactory } from '../../src/users/domain/user.factory';
import { PreferredDisplayMode } from '../../generated/prisma/client';

describe('UserFactory', () => {
  it('should create a valid user', () => {
    const user = UserFactory.create({
      email: 'test@example.com',
      passwordHash: 'hashedPassword123',
    });

    expect(user.email).toBe('test@example.com');
    expect(user.preferredDisplayMode).toBe(PreferredDisplayMode.TRANSLATED);
  });
});
```

### Use Case Test Example

```typescript
import { CreateUserUseCase } from '../../src/users/use-cases/create-user.use-case';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: MockUserRepository;
  let hashingService: MockHashingService;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    hashingService = new MockHashingService();
    useCase = new CreateUserUseCase(userRepository, hashingService);
  });

  it('should create a user successfully', async () => {
    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'SecurePass123',
    });

    expect(result.email).toBe('test@example.com');
  });
});
```

## Coverage

Coverage reports are generated in `coverage/` directory. Open `coverage/index.html` in your browser to view detailed coverage reports.

### Coverage Targets

- Statements: >80%
- Branches: >70%
- Functions: >80%
- Lines: >80%
