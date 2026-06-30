import { ProcessImportUseCase } from '../../../src/imports/use-cases/process-import.use-case';
import { MockImportsRepository } from '../../__mocks__/imports-repository.mock';
import { MockLogger } from '../../__mocks__/logger.mock';
import { ImportStatus } from '../../../generated/prisma/enums';
import { NotFoundException } from '@nestjs/common';
import { ParsedWord } from '../../../src/imports/parser/parsed-word';
import { ProcessImportJob } from '../../../src/imports/jobs/process-import.job';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

describe('ProcessImportUseCase', () => {
  let useCase: ProcessImportUseCase;
  let importsRepository: MockImportsRepository;
  let logger: MockLogger;
  let mockParser: { parse: jest.Mock };
  let mockProcessParsedWord: { execute: jest.Mock };

  const importId = 'import-id-123';
  const userId = 'user-456';
  let filePath: string;

  function makeParsedWord(word: string): ParsedWord {
    return {
      word,
      stem: null,
      lang: 'en',
      bookId: 'B001',
      bookTitle: 'Test Book',
      bookAuthor: 'Test Author',
      context: 'Test context.',
    };
  }

  function createTempFile(): string {
    const path = join(tmpdir(), `test-vocab-${Date.now()}.db`);
    writeFileSync(path, 'test');
    return path;
  }

  beforeEach(async () => {
    jest.clearAllMocks();

    filePath = createTempFile();

    importsRepository = new MockImportsRepository();
    await importsRepository.create({
      userId,
      originalFileName: 'test.db',
      status: ImportStatus.PENDING,
    });

    logger = new MockLogger();

    mockParser = {
      parse: jest.fn().mockReturnValue(
        (function* () {
          // default empty
        })(),
      ),
    };

    mockProcessParsedWord = {
      execute: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new ProcessImportUseCase(
      logger,
      importsRepository,
      mockParser as any,
      mockProcessParsedWord as any,
    );
  });

  afterEach(() => {
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  });

  describe('successful processing', () => {
    it('should process all words and mark as COMPLETED', async () => {
      mockParser.parse.mockReturnValue(
        (function* () {
          yield makeParsedWord('hello');
          yield makeParsedWord('world');
          yield makeParsedWord('test');
        })(),
      );

      await useCase.execute({ importId, filePath });

      expect(mockProcessParsedWord.execute).toHaveBeenCalledTimes(3);

      const record = await importsRepository.findById({ id: importId });
      expect(record?.status).toBe(ImportStatus.COMPLETED);
      expect(record?.completedAt).not.toBeNull();
    });

    it('should log start and completion with word count', async () => {
      mockParser.parse.mockReturnValue(
        (function* () {
          yield makeParsedWord('a');
          yield makeParsedWord('b');
        })(),
      );

      const logSpy = jest.spyOn(logger, 'info');

      await useCase.execute({ importId, filePath });

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Starting import processing: import-id-123'),
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Import import-id-123 completed: 2 words processed'),
      );
    });

    it('should set PROCESSING status before parsing', async () => {
      const updateSpy = jest.spyOn(importsRepository, 'update');

      mockParser.parse.mockReturnValue(
        (function* () {
          yield makeParsedWord('word');
        })(),
      );

      await useCase.execute({ importId, filePath });

      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: importId,
          status: ImportStatus.PROCESSING,
          startedAt: expect.any(Date),
        }),
      );
    });

    it('should pass correct userId and importId to ProcessParsedWordUseCase', async () => {
      const word = makeParsedWord('meditation');
      mockParser.parse.mockReturnValue(
        (function* () {
          yield word;
        })(),
      );

      await useCase.execute({ importId, filePath });

      expect(mockProcessParsedWord.execute).toHaveBeenCalledWith({
        parsedWord: word,
        userId,
        importId,
      });
    });

    it('should delete the temp file after successful processing', async () => {
      const inPath = filePath;
      mockParser.parse.mockReturnValue(
        (function* () {
          yield makeParsedWord('word');
        })(),
      );

      await useCase.execute({ importId, filePath: inPath });

      expect(existsSync(inPath)).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should throw NotFoundException if import does not exist', async () => {
      await expect(
        useCase.execute({ importId: 'nonexistent', filePath }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should mark as FAILED on parser error', async () => {
      mockParser.parse.mockImplementation(() => {
        throw new Error('Parser crashed');
      });

      await useCase.execute({ importId, filePath });

      const record = await importsRepository.findById({ id: importId });
      expect(record?.status).toBe(ImportStatus.FAILED);
      expect(record?.failedAt).not.toBeNull();
      expect(record?.errorMessage).toBe('Parser crashed');
    });

    it('should mark as FAILED when word processing throws', async () => {
      mockParser.parse.mockReturnValue(
        (function* () {
          yield makeParsedWord('good');
          yield makeParsedWord('bad');
        })(),
      );

      mockProcessParsedWord.execute
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Word upsert failed'));

      await useCase.execute({ importId, filePath });

      const record = await importsRepository.findById({ id: importId });
      expect(record?.status).toBe(ImportStatus.FAILED);
    });

    it('should log error on failure', async () => {
      mockParser.parse.mockImplementation(() => {
        throw new Error('Critical error');
      });

      const logSpy = jest.spyOn(logger, 'error');

      await useCase.execute({ importId, filePath });

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Import import-id-123 failed: Critical error'),
      );
    });

    it('should handle non-Error throws', async () => {
      mockParser.parse.mockImplementation(() => {
        throw 'plain string error';
      });

      await useCase.execute({ importId, filePath });

      const record = await importsRepository.findById({ id: importId });
      expect(record?.status).toBe(ImportStatus.FAILED);
      expect(record?.errorMessage).toBe('Unknown error');
    });

    it('should delete temp file even after failure', async () => {
      const errPath = filePath;
      mockParser.parse.mockImplementation(() => {
        throw new Error('fail');
      });

      await useCase.execute({ importId, filePath: errPath });

      expect(existsSync(errPath)).toBe(false);
    });

    it('should not crash if file was already deleted', async () => {
      const missingPath = filePath;
      unlinkSync(missingPath); // delete before useCase tries

      mockParser.parse.mockImplementation(() => {
        throw new Error('fail');
      });

      await expect(
        useCase.execute({ importId, filePath: missingPath }),
      ).resolves.toBeUndefined();
    });
  });
});
