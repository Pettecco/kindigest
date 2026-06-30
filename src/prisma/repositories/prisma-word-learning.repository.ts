import { Injectable } from '@nestjs/common';
import {
  IWordLearningRepository,
  UpsertWordLearningInput,
} from '../../learning/domain/ports/word-learning.repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaWordLearningRepository implements IWordLearningRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertByUserBookWord({
    userId,
    importId,
    bookId,
    wordId,
    context,
  }: UpsertWordLearningInput): Promise<{ created: boolean }> {
    const existing = await this.prisma.wordLearning.findUnique({
      where: {
        userId_bookId_wordId: { userId, bookId, wordId },
      },
    });

    if (existing) {
      return { created: false };
    }

    await this.prisma.wordLearning.create({
      data: {
        userId: userId,
        importId: importId,
        bookId: bookId,
        wordId: wordId,
        context: context,
      },
    });

    return { created: true };
  }

  async findByWordId(
    wordId: string,
  ): Promise<{ context: string | null } | null> {
    const wordLearning = await this.prisma.wordLearning.findFirst({
      where: { wordId },
      select: { context: true },
    });

    return wordLearning ? { context: wordLearning.context } : null;
  }
}
