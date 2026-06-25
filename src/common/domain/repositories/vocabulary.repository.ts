export interface UpsertVocabularyInput {
  userId: string;
  importId: string;
  bookId: string;
  wordId: string;
  context: string | null;
}

export const IVocabularyRepository = Symbol('IVocabularyRepository');

export interface IVocabularyRepository {
  /**
   * Creates or updates a Vocabulary entry based on user, book, and word.
   * @param upsertVocabularyInput The input containing userId, importId, bookId, wordId, and context.
   * @returns A promise that resolves with a boolean indicating if the entry was created.
   */
  upsertByUserBookWord(
    upsertVocabularyInput: UpsertVocabularyInput,
  ): Promise<{ created: boolean }>;
}
