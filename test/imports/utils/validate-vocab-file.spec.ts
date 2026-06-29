import { validateVocabFile } from '../../../src/imports/utils/validate-vocab-file';
import { BadRequestException } from '@nestjs/common';
import { existsSync } from 'node:fs';
import { extname } from 'node:path';
import Database from 'better-sqlite3';

jest.mock('node:fs');
jest.mock('node:path');
jest.mock('better-sqlite3');

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockExtname = extname as jest.MockedFunction<typeof extname>;

function setupValidDb() {
  const mockDb = {
    prepare: jest.fn().mockReturnValue({
      all: jest
        .fn()
        .mockReturnValue([
          { name: 'BOOK_INFO' },
          { name: 'WORDS' },
          { name: 'LOOKUPS' },
        ]),
    }),
    close: jest.fn(),
  };
  (Database as unknown as jest.Mock).mockImplementation(() => mockDb);
  return mockDb;
}

describe('validateVocabFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockExistsSync.mockReturnValue(true);
    mockExtname.mockReturnValue('.db');
    setupValidDb();
  });

  describe('filename character validation', () => {
    it('should accept valid filename', () => {
      expect(() => validateVocabFile('/tmp/file.db', 'vocab.db')).not.toThrow();
    });

    it('should reject filename with angle brackets', () => {
      expect(() => validateVocabFile('/tmp/file.db', 'voc<ab.db')).toThrow(
        BadRequestException,
      );
    });

    it('should reject filename with colon', () => {
      expect(() => validateVocabFile('/tmp/file.db', 'voc:ab.db')).toThrow(
        BadRequestException,
      );
    });

    it('should reject filename with path separators', () => {
      expect(() => validateVocabFile('/tmp/file.db', 'voc/ab.db')).toThrow(
        BadRequestException,
      );
    });

    it('should reject filename with backslash', () => {
      expect(() => validateVocabFile('/tmp/file.db', 'voc\\ab.db')).toThrow(
        BadRequestException,
      );
    });

    it('should accept filename with spaces', () => {
      expect(() =>
        validateVocabFile('/tmp/file.db', 'my vocab.db'),
      ).not.toThrow();
    });

    it('should accept filename with dashes and underscores', () => {
      expect(() =>
        validateVocabFile('/tmp/file.db', 'my-vocab_2024.db'),
      ).not.toThrow();
    });

    it('should reject filename with control characters', () => {
      expect(() => validateVocabFile('/tmp/file.db', 'voc\x00ab.db')).toThrow(
        BadRequestException,
      );
    });
  });

  describe('extension validation', () => {
    it('should accept .db extension', () => {
      mockExtname.mockReturnValue('.db');
      expect(() => validateVocabFile('/tmp/file.db', 'file.db')).not.toThrow();
    });

    it('should accept .DB uppercase extension', () => {
      mockExtname.mockReturnValue('.db');
      expect(() => validateVocabFile('/tmp/file.db', 'file.DB')).not.toThrow();
    });

    it('should reject .txt extension', () => {
      mockExtname.mockReturnValue('.txt');
      expect(() => validateVocabFile('/tmp/file.txt', 'file.txt')).toThrow(
        BadRequestException,
      );
    });

    it('should reject .pdf extension', () => {
      mockExtname.mockReturnValue('.pdf');
      expect(() => validateVocabFile('/tmp/file.pdf', 'file.pdf')).toThrow(
        BadRequestException,
      );
    });
  });

  describe('file existence validation', () => {
    beforeEach(() => {
      setupValidDb();
    });

    it('should accept existing file', () => {
      mockExistsSync.mockReturnValue(true);
      expect(() =>
        validateVocabFile('/tmp/exists.db', 'file.db'),
      ).not.toThrow();
    });

    it('should reject non-existent file', () => {
      mockExistsSync.mockReturnValue(false);
      expect(() => validateVocabFile('/tmp/missing.db', 'file.db')).toThrow(
        BadRequestException,
      );
    });
  });

  describe('SQLite validation', () => {
    it('should accept valid vocab.db with expected tables', () => {
      const mockDb = setupValidDb();

      expect(() =>
        validateVocabFile('/tmp/valid.db', 'valid.db'),
      ).not.toThrow();

      expect(mockDb.close).toHaveBeenCalled();
    });

    it('should reject file missing BOOK_INFO table', () => {
      const mockDb = {
        prepare: jest.fn().mockReturnValue({
          all: jest
            .fn()
            .mockReturnValue([{ name: 'WORDS' }, { name: 'LOOKUPS' }]),
        }),
        close: jest.fn(),
      };

      (Database as unknown as jest.Mock).mockImplementation(() => mockDb);

      expect(() => validateVocabFile('/tmp/bad.db', 'bad.db')).toThrow(
        BadRequestException,
      );
    });

    it('should reject invalid SQLite file', () => {
      (Database as unknown as jest.Mock).mockImplementation(() => {
        throw new Error('not a database');
      });

      expect(() => validateVocabFile('/tmp/corrupt.db', 'corrupt.db')).toThrow(
        BadRequestException,
      );
    });

    it('should close database on error', () => {
      const mockDb = {
        prepare: jest.fn().mockReturnValue({
          all: jest.fn().mockImplementation(() => {
            throw new Error('query error');
          }),
        }),
        close: jest.fn(),
      };

      (Database as unknown as jest.Mock).mockImplementation(() => mockDb);

      expect(() => validateVocabFile('/tmp/error.db', 'error.db')).toThrow(
        BadRequestException,
      );

      expect(mockDb.close).toHaveBeenCalled();
    });
  });
});
