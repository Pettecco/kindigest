import Database from 'better-sqlite3';
import { Injectable } from '@nestjs/common';
import { ParsedWord } from './parsed-word';

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

    for (const row of stmt.iterate() as IterableIterator<ParsedWord>) {
      yield {
        word: row.word,
        stem: row.stem,
        lang: row.lang,
        bookId: row.bookId,
        bookTitle: row.bookTitle,
        bookAuthor: row.bookAuthor,
        context: row.context,
      };
    }

    db.close();
  }
}
