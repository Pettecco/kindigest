import { Module, forwardRef } from '@nestjs/common';
import { ImportsController } from './imports.controller';
import { CreateImportUseCase } from './use-cases/create-import.use-case';
import { makeLogger } from '../common/factories/logger';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { IJobQueue, QUEUES } from 'src/common/queue';
import { BullMQJobQueue } from './infrastructure/queue';
import { ProcessImportUseCase, ProcessParsedWordUseCase } from './use-cases';
import { ProcessImportWorker } from './infrastructure/workers';
import { KindleVocabularyParser } from './parser/kindle-vocabulary-parser';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.PROCESS_IMPORT,
    }),
    forwardRef(() => AuthModule),
    PrismaModule,
  ],
  controllers: [ImportsController],
  providers: [
    makeLogger('ImportsModule'),
    BullMQJobQueue,
    {
      provide: IJobQueue,
      useClass: BullMQJobQueue,
    },
    CreateImportUseCase,
    ProcessImportUseCase,
    ProcessParsedWordUseCase,
    ProcessImportWorker,
    KindleVocabularyParser,
  ],
  exports: [IJobQueue],
})
export class ImportsModule {}
