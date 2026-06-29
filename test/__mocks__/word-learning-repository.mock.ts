import {
  IWordLearningRepository,
  UpsertWordLearningInput,
} from '../../src/learning/domain/ports/word-learning.repository';

export class MockWordLearningRepository implements IWordLearningRepository {
  private entries: UpsertWordLearningInput[] = [];

  async upsertByUserBookWord(
    input: UpsertWordLearningInput,
  ): Promise<{ created: boolean }> {
    const existing = this.entries.find(
      (e) =>
        e.userId === input.userId &&
        e.bookId === input.bookId &&
        e.wordId === input.wordId,
    );

    if (existing) {
      return { created: false };
    }

    this.entries.push(input);
    return { created: true };
  }

  getEntries(): readonly UpsertWordLearningInput[] {
    return this.entries;
  }

  clear(): void {
    this.entries = [];
  }
}
