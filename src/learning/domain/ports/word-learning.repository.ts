export interface UpsertWordLearningInput {
  userId: string;
  importId: string;
  bookId: string;
  wordId: string;
  context: string | null;
}

export const IWordLearningRepository = Symbol('IWordLearningRepository');

export interface IWordLearningRepository {
  /**
   * Creates or updates a WordLearning entry based on user, book, and word.
   * @param upsertWordLearningInput The input containing userId, importId, bookId, wordId, and context.
   * @returns A promise that resolves with a boolean indicating if the entry was created.
   */
  upsertByUserBookWord(
    upsertWordLearningInput: UpsertWordLearningInput,
  ): Promise<{ created: boolean }>;
}
