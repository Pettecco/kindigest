import { Language } from 'generated/prisma/enums';

export interface Word {
  id: string;
  word: string;
  stem: string | null;
  language: Language;
  translatedWord: string | null;
}
