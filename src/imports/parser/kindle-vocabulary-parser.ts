import Database from 'better-sqlite3';
import { Injectable } from '@nestjs/common';
import { ParsedWord } from './parsed-word';
import { MAX_VOCAB_ROWS, CONTROL_CHARS } from '../infrastructure/upload/constants';

interface VocabRow {
  word: string;
  stem: string | null;
  lang: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  context: string | null;
}

@Injectable()
export class KindleVocabularyParser {
  *parse(filePath: string): Generator<ParsedWord> {
    const db = new Database(filePath, { readonly: true });

    const stmt = db.prepare(`
      SELECT
        w.word,
        w.stem,
        w.lang,
        b.asin      AS bookId,
        b.title     AS bookTitle,
        b.authors   AS bookAuthor,
        l.usage     AS context
      FROM WORDS w
      JOIN LOOKUPS l ON l.word_key = w.id
      JOIN BOOK_INFO b ON b.id = l.book_key
    `);

    let rowCount = 0;

    for (const row of stmt.iterate() as IterableIterator<VocabRow>) {
      if (rowCount >= MAX_VOCAB_ROWS) break;

      yield {
        word: clean(row.word) || '',
        stem: clean(row.stem),
        lang: clean(row.lang) || '',
        bookId: clean(row.bookId) || '',
        bookTitle: clean(row.bookTitle) || '',
        bookAuthor: clean(row.bookAuthor) || '',
        context: clean(row.context),
      };

      rowCount++;
    }

    db.close();
  }
}

function clean(value: string | null): string | null {
  if (!value) return null;

  return value.replace(CONTROL_CHARS, '').trim() || null;
}
