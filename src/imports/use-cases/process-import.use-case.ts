import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IImportsRepository } from '../domain';
import { KindleVocabularyParser } from '../parser/kindle-vocabulary-parser';
import { ProcessParsedWordUseCase } from './process-parsed-word.use-case';
import { ImportStatus } from 'generated/prisma/enums';
import { unlink } from 'node:fs/promises';
import { UseCase } from 'src/common/interfaces';
import { ILogger } from 'src/common/interfaces/logger';
import { ProcessImportJob } from '../jobs/process-import.job';

@Injectable()
export class ProcessImportUseCase implements UseCase<ProcessImportJob, void> {
  constructor(
    @Inject(ILogger)
    private readonly logger: ILogger,
    @Inject(IImportsRepository)
    private readonly importsRepository: IImportsRepository,
    private readonly parser: KindleVocabularyParser,
    private readonly processParsedWord: ProcessParsedWordUseCase,
  ) {}

  async execute({ importId, filePath }: ProcessImportJob): Promise<void> {
    this.logger.info(`Starting import processing: ${importId}`);

    const importRecord = await this.importsRepository.findById({
      id: importId,
    });

    if (!importRecord) {
      throw new NotFoundException('Import not found');
    }

    try {
      await this.importsRepository.update({
        id: importId,
        status: ImportStatus.PROCESSING,
        startedAt: new Date(),
      });

      let wordCount = 0;

      for (const parsedWord of this.parser.parse(filePath)) {
        await this.processParsedWord.execute({
          parsedWord,
          userId: importRecord.userId,
          importId,
        });
        wordCount++;
      }

      await this.importsRepository.update({
        id: importId,
        status: ImportStatus.COMPLETED,
        completedAt: new Date(),
      });

      this.logger.info(
        `Import ${importId} completed: ${wordCount} words processed`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Import ${importId} failed: ${message}`);

      await this.importsRepository.update({
        id: importId,
        status: ImportStatus.FAILED,
        failedAt: new Date(),
        errorMessage: message,
      });
    } finally {
      await unlink(filePath).catch(() => {});
    }
  }
}
