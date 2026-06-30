import { KindleVocabularyParser } from '../../../src/imports/parser/kindle-vocabulary-parser';
import { resolve } from 'node:path';

const TEST_VOCAB_DB = resolve(__dirname, '../../..', 'vocab.db');

describe('KindleVocabularyParser', () => {
  let parser: KindleVocabularyParser;

  beforeEach(() => {
    parser = new KindleVocabularyParser();
  });

  it('should yield ParsedWord objects', () => {
    const words = [...parser.parse(TEST_VOCAB_DB)];

    expect(words.length).toBeGreaterThan(0);

    const first = words[0];
    expect(first).toHaveProperty('word');
    expect(first).toHaveProperty('stem');
    expect(first).toHaveProperty('lang');
    expect(first).toHaveProperty('bookId');
    expect(first).toHaveProperty('bookTitle');
    expect(first).toHaveProperty('bookAuthor');
    expect(first).toHaveProperty('context');
  });

  it('should parse all words from vocab.db', () => {
    const words = [...parser.parse(TEST_VOCAB_DB)];

    expect(words.length).toBe(2767);
  });

  it('should map SQL aliases to ParsedWord fields', () => {
    const [first] = [...parser.parse(TEST_VOCAB_DB)];

    expect(typeof first.word).toBe('string');
    expect(first.word.length).toBeGreaterThan(0);
    expect(typeof first.bookId).toBe('string');
    expect(typeof first.bookTitle).toBe('string');
    expect(typeof first.bookAuthor).toBe('string');
  });

  it('should yield unique book titles', () => {
    const words = [...parser.parse(TEST_VOCAB_DB)];
    const uniqueBooks = new Set(words.map(w => w.bookTitle));

    expect(uniqueBooks.size).toBeGreaterThan(1);
    expect(uniqueBooks.size).toBeLessThanOrEqual(31);
  });

  it('should include language codes en, pt, es', () => {
    const words = [...parser.parse(TEST_VOCAB_DB)];
    const langs = new Set(words.map(w => w.lang));

    expect(langs.has('en')).toBe(true);
    expect(langs.has('pt')).toBe(true);
    expect(langs.has('es')).toBe(true);
  });

  it('should clean strings via trim', () => {
    const words = [...parser.parse(TEST_VOCAB_DB)];

    for (const word of words) {
      expect(word.word).toBe(word.word.trim());
      expect(word.bookTitle).toBe(word.bookTitle.trim());
      expect(word.bookAuthor).toBe(word.bookAuthor.trim());
    }
  });

  it('should stop at max rows limit', () => {
    const wordsIterator = parser.parse(TEST_VOCAB_DB);
    let count = 0;

    for (const _ of wordsIterator) {
      count++;
    }

    expect(count).toBeLessThanOrEqual(50000);
    expect(count).toBe(2767);
  });

  it('should throw for non-existent file', () => {
    expect(() => [...parser.parse('/tmp/nonexistent_vocab.db')]).toThrow();
  });

  it('should support Generator iteration pattern', () => {
    const iterator = parser.parse(TEST_VOCAB_DB);

    expect(iterator[Symbol.iterator]).toBeDefined();

    const first = iterator.next();
    expect(first.done).toBe(false);
    expect(first.value).toBeDefined();
  });

  it('should handle multiple independent iterations', () => {
    const words1 = [...parser.parse(TEST_VOCAB_DB)];
    const words2 = [...parser.parse(TEST_VOCAB_DB)];

    expect(words1.length).toBe(words2.length);
    expect(words1[0].word).toBe(words2[0].word);
  });
});
