import {
  IBooksRepository,
  UpsertBookInput,
} from '../../src/books/domain/ports/books.repository';
import { Book } from '../../src/books/domain/entities/book';

export class MockBooksRepository implements IBooksRepository {
  private books: Book[] = [];
  private nextId = 1;

  async upsertByKindleBookId(
    input: UpsertBookInput,
  ): Promise<{ book: Book; created: boolean }> {
    const existing = this.books.find((b) => b.kindleBookId === input.kindleBookId);

    if (existing) {
      existing.title = input.title;
      existing.author = input.author;
      return { book: existing, created: false };
    }

    const book: Book = {
      id: `book-id-${this.nextId++}`,
      kindleBookId: input.kindleBookId,
      title: input.title,
      author: input.author,
    };
    this.books.push(book);
    return { book, created: true };
  }

  clear(): void {
    this.books = [];
    this.nextId = 1;
  }
}
