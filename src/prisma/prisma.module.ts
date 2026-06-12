import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { PrismaUserRepository } from './repositories/index.js';
import { IUsersRepository } from '../users/domain/user-repository.js';
import { AuthModule } from '../auth/auth.module.js';

@Global()
@Module({
  imports: [AuthModule],
  providers: [
    PrismaService,
    {
      provide: IUsersRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [PrismaService, IUsersRepository],
})
export class PrismaModule {}
