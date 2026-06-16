# Tests

Unit and integration tests for Kindigest.

## Structure

```
test/
├── jest-unit.json          # Jest config for unit tests
├── README.md               # This file
├── __builders__/           # Test data builders
│   └── user.builder.ts
├── __mocks__/              # Shared mock implementations
│   ├── user-repository.mock.ts
│   ├── hashing-service.mock.ts
│   └── logger.mock.ts
├── auth/                   # Auth module tests
│   └── hashing/
└── users/                  # Users module tests
    ├── domain/
    └── use-cases/
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
yarn test:unit

# Run with coverage
yarn test:unit:cov

# Run specific test file
yarn test:unit -- users/domain/user.spec.ts

# Run in watch mode
yarn test:unit:watch
```

### E2E Tests

```bash
# Run all e2e tests
yarn test:e2e
```

## Writing Tests

### Using Test Builders

```typescript
import { UserBuilder } from '../../__builders__/user.builder';
import { PreferredDisplayMode } from '../../generated/prisma/enums';

const user = UserBuilder.create()
  .withEmail('test@example.com')
  .withDisplayMode(PreferredDisplayMode.IMMERSIVE)
  .build();
```

### Using Mock Repositories

```typescript
import { MockUserRepository } from '../../__mocks__/user-repository.mock';

const userRepository = new MockUserRepository();
const useCase = new CreateUserUseCase(userRepository, hashingService);
```

### Unit Test Example

```typescript
import { UserFactory } from '../../src/users/domain/user.factory';

describe('UserFactory', () => {
  it('should create a valid user', () => {
    const user = UserFactory.create({
      email: 'test@example.com',
      passwordHash: 'hashedPassword123',
    });

    expect(user.email).toBe('test@example.com');
  });
});
```

### Use Case Test Example

```typescript
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: MockUserRepository;

  beforeEach(() => {
    userRepository = new MockUserRepository();
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
