import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { PrismaUserRepository } from './repositories/index.js';
import { IUsersRepository } from '../users/domain/user-repository.js';

@Global()
@Module({
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
