import { Injectable } from '@nestjs/common';
import {
  IVocabularyRepository,
  UpsertVocabularyInput,
} from '../../learning/domain/ports/vocabulary.repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaVocabularyRepository implements IVocabularyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertByUserBookWord({
    userId,
    importId,
    bookId,
    wordId,
    context,
  }: UpsertVocabularyInput): Promise<{ created: boolean }> {
    const existing = await this.prisma.vocabulary.findUnique({
      where: {
        userId_bookId_wordId: { userId, bookId, wordId },
      },
    });

    if (existing) {
      return { created: false };
    }

    await this.prisma.vocabulary.create({
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
}
