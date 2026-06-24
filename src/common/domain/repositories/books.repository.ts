import { Book } from '../entities';

export const IBooksRepository = Symbol('IBooksRepository');

export interface IBooksRepository {
  upsertByKindleBookId(data: {
    kindleBookId: string;
    title: string;
    author: string;
  }): Promise<{ book: Book; created: boolean }>;
}
