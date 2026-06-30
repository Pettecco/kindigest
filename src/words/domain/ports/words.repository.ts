import { Word } from '../entities';
import { Language } from 'generated/prisma/enums';

export interface UpsertWordInput {
  word: string;
  stem: string | null;
  language: Language;
  translatedWord: string | null;
}

export const IWordsRepository = Symbol('IWordsRepository');

export interface IWordsRepository {
  /**
   * Creates or updates a Word entity based on word and language.
   * @param upsertWordInput The input containing word, stem, language, and translatedWord.
   * @returns A promise that resolves with the Word entity and a boolean indicating if it was created.
   */
  upsertByWordAndLanguage(
    upsertWordInput: UpsertWordInput,
  ): Promise<{ word: Word; created: boolean }>;

  findById(id: string): Promise<Word | null>;

  update(input: { id: string; translatedWord: string | null }): Promise<Word>;
}
