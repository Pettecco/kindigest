import {
  IWordsRepository,
  UpsertWordInput,
} from '../../src/words/domain/ports/words.repository';
import { Word } from '../../src/words/domain/entities/word';

export class MockWordsRepository implements IWordsRepository {
  private words: Word[] = [];
  private nextId = 1;

  async upsertByWordAndLanguage(
    input: UpsertWordInput,
  ): Promise<{ word: Word; created: boolean }> {
    const existing = this.words.find(
      (w) => w.word === input.word && w.language === input.language,
    );

    if (existing) {
      existing.stem = input.stem;
      existing.translatedWord = input.translatedWord;
      return { word: existing, created: false };
    }

    const word: Word = {
      id: `word-id-${this.nextId++}`,
      word: input.word,
      stem: input.stem,
      language: input.language,
      translatedWord: input.translatedWord,
    };
    this.words.push(word);
    return { word, created: true };
  }

  clear(): void {
    this.words = [];
    this.nextId = 1;
  }
}
