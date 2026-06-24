import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as repositories from './repositories';
import * as mappers from './mappers';
import {
  IUsersRepository,
  IImportsRepository,
  IBooksRepository,
  IWordsRepository,
  IVocabularyRepository,
} from '../common/domain';

@Global()
@Module({
  providers: [
    PrismaService,
    mappers.ImportMapper,
    mappers.BookMapper,
    mappers.WordMapper,
    mappers.UserMapper,
    {
      provide: IUsersRepository,
      useClass: repositories.PrismaUserRepository,
    },
    {
      provide: IImportsRepository,
      useClass: repositories.PrismaImportsRepository,
    },
    {
      provide: IBooksRepository,
      useClass: repositories.PrismaBooksRepository,
    },
    {
      provide: IWordsRepository,
      useClass: repositories.PrismaWordsRepository,
    },
    {
      provide: IVocabularyRepository,
      useClass: repositories.PrismaVocabularyRepository,
    },
  ],
  exports: [
    PrismaService,
    IUsersRepository,
    IImportsRepository,
    IBooksRepository,
    IWordsRepository,
    IVocabularyRepository,
  ],
})
export class PrismaModule {}
