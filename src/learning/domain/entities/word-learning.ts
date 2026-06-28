export interface WordLearning {
  id: string;
  userId: string;
  importId: string;
  bookId: string;
  wordId: string;
  context: string | null;
  learnCount: number;
  createdAt: Date;
}
