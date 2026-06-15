import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/create-user.use-case.js';
import { FindUserByEmailUseCase } from './use-cases/find-user-by-email.use-case.js';
import { FindUserByIdUseCase } from './use-cases/find-user-by-id.use-case.js';
import { UsersController } from './users.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { makeHashingFactory } from '../common/factories/hashing.factory.js';
import { makeLogger } from '../common/factories/logger.js';

@Module({
  imports: [PrismaModule],
  providers: [
    makeHashingFactory,
    makeLogger('UsersModule'),
    CreateUserUseCase,
    FindUserByEmailUseCase,
    FindUserByIdUseCase,
  ],
  controllers: [UsersController],
  exports: [CreateUserUseCase, FindUserByEmailUseCase, FindUserByIdUseCase],
})
export class UsersModule {}
