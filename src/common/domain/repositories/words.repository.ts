import { Word } from '../entities';
import { Language } from 'generated/prisma/enums';

export const IWordsRepository = Symbol('IWordsRepository');

export interface IWordsRepository {
  upsertByWordAndLanguage(data: {
    word: string;
    stem: string | null;
    language: Language;
    translatedWord: string | null;
  }): Promise<{ word: Word; created: boolean }>;
}
