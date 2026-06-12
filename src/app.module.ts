import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { FindUserByEmailUseCase } from './users/use-cases/find-user-by-email.use-case.js';
import { FindUserByIdUseCase } from './users/use-cases/find-user-by-id.use-case.js';
import { CreateUserUseCase } from './users/use-cases/create-user.use-case.js';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule],
  providers: [FindUserByEmailUseCase, FindUserByIdUseCase, CreateUserUseCase],
})
export class AppModule {}
