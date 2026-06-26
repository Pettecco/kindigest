import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { UseCase } from '../../common/interfaces/use-case';
import { ILogger } from '../../common/interfaces/logger';
import { IImportsRepository } from '../domain/ports/imports.repository';
import { IBooksRepository } from '../../books/domain/ports/books.repository';
import { IWordsRepository } from '../../words/domain/ports/words.repository';
import { IVocabularyRepository } from '../../learning/domain/ports/vocabulary.repository';

@Injectable()
export class UploadVocabFileUseCase implements UseCase<void, void> {
  constructor(
    @Inject(ILogger)
    private readonly logger: ILogger,
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
