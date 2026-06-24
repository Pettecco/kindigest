import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { UseCase } from '../../common/interfaces/use-case';
import { ILogger } from '../../common/interfaces/logger';
import {
  IImportsRepository,
  IBooksRepository,
  IWordsRepository,
  IVocabularyRepository,
} from 'src/common/domain';

@Injectable()
export class UploadVocabFileUseCase implements UseCase<void, void> {
  constructor(
    @Inject(ILogger) private readonly logger: ILogger,
    @Inject(IImportsRepository)
    private readonly importsRepository: IImportsRepository,
    @Inject(IBooksRepository)
    private readonly booksRepository: IBooksRepository,
    @Inject(IWordsRepository)
    private readonly wordsRepository: IWordsRepository,
    @Inject(IVocabularyRepository)
    private readonly vocabularyRepository: IVocabularyRepository,
  ) {}

  async execute(): Promise<void> {}
}
