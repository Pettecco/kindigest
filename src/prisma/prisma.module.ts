import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaUserRepository } from './repositories/index';
import { IUsersRepository } from '../users/domain/user-repository';

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
