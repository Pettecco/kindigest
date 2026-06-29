import {
  ProcessParsedWordUseCase,
  ProcessParsedWordInput,
} from '../../../src/imports/use-cases/process-parsed-word.use-case';
import { MockBooksRepository } from '../../__mocks__/books-repository.mock';
import { MockWordsRepository } from '../../__mocks__/words-repository.mock';
import { MockWordLearningRepository } from '../../__mocks__/word-learning-repository.mock';
import { MockLogger } from '../../__mocks__/logger.mock';
import { ParsedWord } from '../../../src/imports/parser/parsed-word';
import { Language } from '../../../generated/prisma/enums';

describe('ProcessParsedWordUseCase', () => {
  let useCase: ProcessParsedWordUseCase;
  let booksRepository: MockBooksRepository;
  let wordsRepository: MockWordsRepository;
  let wordLearningRepository: MockWordLearningRepository;
  let logger: MockLogger;

  const parsedWord: ParsedWord = {
    word: 'meditation',
    stem: 'meditat',
    lang: 'en',
    bookId: 'B00555X8OA',
    bookTitle: 'Thinking, Fast and Slow',
    bookAuthor: 'Kahneman, Daniel',
    context: 'He practiced meditation daily.',
  };

  const input: ProcessParsedWordInput = {
    parsedWord,
    userId: 'user-123',
    importId: 'import-456',
  };

  beforeEach(() => {
    booksRepository = new MockBooksRepository();
    wordsRepository = new MockWordsRepository();
    wordLearningRepository = new MockWordLearningRepository();
    logger = new MockLogger();
    useCase = new ProcessParsedWordUseCase(
      logger,
      booksRepository,
      wordsRepository,
      wordLearningRepository,
    );
  });

  it('should upsert book, word, and wordLearning in order', async () => {
    const bookSpy = jest.spyOn(booksRepository, 'upsertByKindleBookId');
    const wordSpy = jest.spyOn(wordsRepository, 'upsertByWordAndLanguage');
    const wlSpy = jest.spyOn(wordLearningRepository, 'upsertByUserBookWord');

    await useCase.execute(input);

    expect(bookSpy).toHaveBeenCalledWith({
      kindleBookId: 'B00555X8OA',
      title: 'Thinking, Fast and Slow',
      author: 'Kahneman, Daniel',
    });
    expect(wordSpy).toHaveBeenCalledWith({
      word: 'meditation',
      stem: 'meditat',
      language: Language.EN,
      translatedWord: null,
    });
    expect(wlSpy).toHaveBeenCalledWith({
      userId: 'user-123',
      importId: 'import-456',
      bookId: 'book-id-1',
      wordId: 'word-id-1',
      context: 'He practiced meditation daily.',
    });
  });

  it('should map lang to uppercase Language enum', async () => {
    const wordSpy = jest.spyOn(wordsRepository, 'upsertByWordAndLanguage');

    await useCase.execute({
      ...input,
      parsedWord: { ...parsedWord, lang: 'pt' },
    });

    expect(wordSpy).toHaveBeenCalledWith(
      expect.objectContaining({ language: Language.PT }),
    );
  });

  it('should skip words with unsupported language (DE)', async () => {
    const bookSpy = jest.spyOn(booksRepository, 'upsertByKindleBookId');
    const debugSpy = jest.spyOn(logger, 'debug');

    await useCase.execute({
      ...input,
      parsedWord: { ...parsedWord, lang: 'de' },
    });

    expect(debugSpy).toHaveBeenCalledWith(
      expect.stringContaining('Skipping unsupported language: de'),
    );
    expect(bookSpy).not.toHaveBeenCalled();
  });

  it('should skip words with unsupported language (IT)', async () => {
    const wordSpy = jest.spyOn(wordsRepository, 'upsertByWordAndLanguage');

    await useCase.execute({
      ...input,
      parsedWord: { ...parsedWord, lang: 'it' },
    });

    expect(wordSpy).not.toHaveBeenCalled();
  });

  it('should handle null stem', async () => {
    const wordSpy = jest.spyOn(wordsRepository, 'upsertByWordAndLanguage');

    await useCase.execute({
      ...input,
      parsedWord: { ...parsedWord, stem: null },
    });

    expect(wordSpy).toHaveBeenCalledWith(
      expect.objectContaining({ stem: null }),
    );
  });

  it('should handle null context', async () => {
    const wlSpy = jest.spyOn(wordLearningRepository, 'upsertByUserBookWord');

    await useCase.execute({
      ...input,
      parsedWord: { ...parsedWord, context: null },
    });

    expect(wlSpy).toHaveBeenCalledWith(
      expect.objectContaining({ context: null }),
    );
  });

  it('should reuse existing book on second upsert', async () => {
    await useCase.execute(input);

    const secondParsed: ParsedWord = {
      ...parsedWord,
      word: 'different-word',
    };

    await useCase.execute({ ...input, parsedWord: secondParsed });

    const bookSpy = jest.spyOn(booksRepository, 'upsertByKindleBookId');
    await useCase.execute({
      ...input,
      parsedWord: { ...parsedWord, word: 'third' },
    });

    expect(bookSpy).toHaveBeenCalledTimes(1);
    expect(bookSpy).toHaveBeenCalledWith(
      expect.objectContaining({ kindleBookId: 'B00555X8OA' }),
    );
  });
});
