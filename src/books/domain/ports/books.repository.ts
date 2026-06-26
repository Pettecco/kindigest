import { Book } from '../entities';

export interface UpsertBookInput {
  kindleBookId: string;
  title: string;
  author: string;
}

export const IBooksRepository = Symbol('IBooksRepository');

export interface IBooksRepository {
  /**
   * Creates or updates a Book entity based on Kindle book ID.
   * @param upsertBookInput The input containing kindleBookId, title, and author.
   * @returns A promise that resolves with the Book entity and a boolean indicating if it was created.
   */
  upsertByKindleBookId(
    upsertBookInput: UpsertBookInput,
  ): Promise<{ book: Book; created: boolean }>;
}
