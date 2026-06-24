import { Injectable } from '@nestjs/common';
import { IVocabularyRepository } from 'src/common/domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaVocabularyRepository implements IVocabularyRepository {
  constructor(private prisma: PrismaService) {}

  async upsertByUserBookWord(data: {
    userId: string;
    importId: string;
    bookId: string;
    wordId: string;
    context: string | null;
  }): Promise<{ created: boolean }> {
    const existing = await this.prisma.vocabulary.findUnique({
      where: {
        userId_bookId_wordId: {
          userId: data.userId,
          bookId: data.bookId,
          wordId: data.wordId,
        },
      },
    });

    if (existing) {
      return { created: false };
    }

    await this.prisma.vocabulary.create({
      data: {
        userId: data.userId,
        importId: data.importId,
        bookId: data.bookId,
        wordId: data.wordId,
        context: data.context,
      },
    });

    return { created: true };
  }
}
