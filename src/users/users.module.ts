import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/create-user.use-case.js';
import { UsersController } from './controllers/users.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { IUsersRepository } from './domain/user-repository.js';
import { PrismaUserRepository } from '../prisma/repositories/prisma-users.repository.js';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    CreateUserUseCase,
    {
      provide: IUsersRepository,
      useClass: PrismaUserRepository,
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
