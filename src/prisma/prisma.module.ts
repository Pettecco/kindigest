import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaUserRepository } from './repositories/prisma-users.repository';
import { PrismaImportsRepository } from './repositories/prisma-imports.repository';
import { PrismaBooksRepository } from './repositories/prisma-books.repository';
import { PrismaWordsRepository } from './repositories/prisma-words.repository';
import { PrismaWordLearningRepository } from './repositories/prisma-word-learning.repository';
import { UserMapper } from './mappers/user.mapper';
import { ImportMapper } from './mappers/import.mapper';
import { BookMapper } from './mappers/book.mapper';
import { WordMapper } from './mappers/word.mapper';
import { IUsersRepository } from '../users/domain/ports/users.repository';
import { IImportsRepository } from '../imports/domain/ports/imports.repository';
import { IBooksRepository } from '../books/domain/ports/books.repository';
import { IWordsRepository } from '../words/domain/ports/words.repository';
import { IWordLearningRepository } from '../learning/domain/ports/word-learning.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    UserMapper,
    ImportMapper,
    BookMapper,
    WordMapper,
    PrismaUserRepository,
    {
      provide: IUsersRepository,
      useExisting: PrismaUserRepository,
    },
    PrismaImportsRepository,
    {
      provide: IImportsRepository,
      useExisting: PrismaImportsRepository,
    },
    PrismaBooksRepository,
    {
      provide: IBooksRepository,
      useExisting: PrismaBooksRepository,
    },
    PrismaWordsRepository,
    {
      provide: IWordsRepository,
      useExisting: PrismaWordsRepository,
    },
    PrismaWordLearningRepository,
    {
      provide: IWordLearningRepository,
      useExisting: PrismaWordLearningRepository,
    },
  ],
  exports: [
    PrismaService,
    IUsersRepository,
    IImportsRepository,
    IBooksRepository,
    IWordsRepository,
    IWordLearningRepository,
  ],
})
export class PrismaModule {}
