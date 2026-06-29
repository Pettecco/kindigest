import Database from 'better-sqlite3';
import { Injectable } from '@nestjs/common';
import { ParsedWord } from './parsed-word';
import { MAX_VOCAB_ROWS } from '../infrastructure/upload/constants';
import { clean } from '../utils';

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

    for (const row of stmt.iterate() as IterableIterator<ParsedWord>) {
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
