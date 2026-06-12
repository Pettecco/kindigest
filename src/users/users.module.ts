import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/create-user.use-case.js';
import { FindUserByEmailUseCase } from './use-cases/find-user-by-email.use-case.js';
import { FindUserByIdUseCase } from './use-cases/find-user-by-id.use-case.js';
import { UsersController } from './users.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { IUsersRepository } from './domain/user-repository.js';
import { PrismaUserRepository } from '../prisma/repositories/prisma-users.repository.js';

@Module({
  imports: [PrismaModule],
  providers: [
    CreateUserUseCase,
    FindUserByEmailUseCase,
    FindUserByIdUseCase,
    {
      provide: IUsersRepository,
      useClass: PrismaUserRepository,
    },
  ],
  controllers: [UsersController],
  exports: [
    CreateUserUseCase,
    FindUserByEmailUseCase,
    FindUserByIdUseCase,
    IUsersRepository,
  ],
})
export class UsersModule {}
