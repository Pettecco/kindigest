import { Injectable } from '@nestjs/common';
import { IWordsRepository, Word } from 'src/common/domain';
import { PrismaService } from '../prisma.service';
import { WordMapper } from '../mappers';
import { Language } from '../../../generated/prisma/client';

@Injectable()
export class PrismaWordsRepository implements IWordsRepository {
  constructor(
    private prisma: PrismaService,
    private wordMapper: WordMapper,
  ) {}

  async upsertByWordAndLanguage(data: {
    word: string;
    stem: string | null;
    language: Language;
    translatedWord: string | null;
  }): Promise<{ word: Word; created: boolean }> {
    const existing = await this.prisma.words.findUnique({
      where: {
        word_language: {
          word: data.word,
          language: data.language,
        },
      },
    });

    if (existing) {
      const updated = await this.prisma.words.update({
        where: { id: existing.id },
        data: {
          stem: data.stem,
          translatedWord: data.translatedWord,
        },
      });

      return { word: this.wordMapper.toDomain(updated), created: false };
    }

    const created = await this.prisma.words.create({
      data: {
        word: data.word,
        stem: data.stem,
        language: data.language,
        translatedWord: data.translatedWord,
      },
    });

    return { word: this.wordMapper.toDomain(created), created: true };
  }
}
