import { Injectable, Inject } from '@nestjs/common';
import { UseCase } from '../../common/interfaces/use-case';
import { ILogger } from '../../common/interfaces/logger';
import { IBooksRepository } from '../../books/domain/ports/books.repository';
import { IWordsRepository } from '../../words/domain/ports/words.repository';
import { IWordLearningRepository } from '../../learning/domain/ports/word-learning.repository';
import { ParsedWord } from '../parser/parsed-word';
import { Language } from 'generated/prisma/enums';

const SUPPORTED_LANGUAGES: Set<string> = new Set(Object.values(Language));

@Injectable()
export class ProcessParsedWordUseCase implements UseCase<
  ProcessParsedWordInput,
  void
> {
  constructor(
    @Inject(ILogger)
    private readonly logger: ILogger,
    @Inject(IBooksRepository)
    private readonly booksRepository: IBooksRepository,
    @Inject(IWordsRepository)
    private readonly wordsRepository: IWordsRepository,
    @Inject(IWordLearningRepository)
    private readonly wordLearningRepository: IWordLearningRepository,
  ) {}

  async execute({
    parsedWord,
    userId,
    importId,
  }: ProcessParsedWordInput): Promise<void> {
    const language = parsedWord.lang.toUpperCase();

    if (!SUPPORTED_LANGUAGES.has(language)) {
      this.logger.debug(`Skipping unsupported language: ${parsedWord.lang} (${parsedWord.word})`);
      return;
    }

    const { book } = await this.booksRepository.upsertByKindleBookId({
      kindleBookId: parsedWord.bookId,
      title: parsedWord.bookTitle,
      author: parsedWord.bookAuthor,
    });

    const { word } = await this.wordsRepository.upsertByWordAndLanguage({
      word: parsedWord.word,
      stem: parsedWord.stem,
      language: language as Language,
      translatedWord: null,
    });

    await this.wordLearningRepository.upsertByUserBookWord({
      userId,
      importId,
      bookId: book.id,
      wordId: word.id,
      context: parsedWord.context,
    });
  }
}

export interface ProcessParsedWordInput {
  parsedWord: ParsedWord;
  userId: string;
  importId: string;
}
