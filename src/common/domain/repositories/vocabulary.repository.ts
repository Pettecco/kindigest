export const IVocabularyRepository = Symbol('IVocabularyRepository');

export interface IVocabularyRepository {
  upsertByUserBookWord(data: {
    userId: string;
    importId: string;
    bookId: string;
    wordId: string;
    context: string | null;
  }): Promise<{ created: boolean }>;
}
