import { Injectable, Inject } from '@nestjs/common';
import { UseCase } from '../../common/interfaces/use-case';
import { IBooksRepository } from '../../books/domain/ports/books.repository';
import { IWordsRepository } from '../../words/domain/ports/words.repository';
import { IWordLearningRepository } from '../../learning/domain/ports/word-learning.repository';
import { ParsedWord } from '../parser/parsed-word';
import { Language } from 'generated/prisma/enums';

@Injectable()
export class ProcessParsedWordUseCase implements UseCase<
  ProcessParsedWordInput,
  void
> {
  constructor(
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
    const { book } = await this.booksRepository.upsertByKindleBookId({
      kindleBookId: parsedWord.bookId,
      title: parsedWord.bookTitle,
      author: parsedWord.bookAuthor,
    });

    const language = parsedWord.lang.toUpperCase() as Language;

    const { word } = await this.wordsRepository.upsertByWordAndLanguage({
      word: parsedWord.word,
      stem: parsedWord.stem,
      language,
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
