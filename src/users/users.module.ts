import { Module, forwardRef } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { FindUserByEmailUseCase } from './use-cases/find-user-by-email.use-case';
import { FindUserByIdUseCase } from './use-cases/find-user-by-id.use-case';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { makeHashingFactory } from '../common/factories/hashing.factory';
import { makeLogger } from '../common/factories/logger';
import { UpdatePreferredDisplayModeUseCase } from './use-cases';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  providers: [
    makeHashingFactory,
    makeLogger('UsersModule'),
    CreateUserUseCase,
    FindUserByEmailUseCase,
    FindUserByIdUseCase,
    UpdatePreferredDisplayModeUseCase,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
