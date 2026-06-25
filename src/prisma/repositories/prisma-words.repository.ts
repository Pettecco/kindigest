import { Injectable } from '@nestjs/common';
import { IWordsRepository, UpsertWordInput, Word } from 'src/common/domain';
import { PrismaService } from '../prisma.service';
import { WordMapper } from '../mappers';
import { Language } from '../../../generated/prisma/client';

@Injectable()
export class PrismaWordsRepository implements IWordsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wordMapper: WordMapper,
  ) {}

  async upsertByWordAndLanguage({
    word,
    stem,
    language,
    translatedWord,
  }: UpsertWordInput): Promise<{ word: Word; created: boolean }> {
    const existing = await this.prisma.words.findUnique({
      where: { word_language: { word, language } },
    });

    if (existing) {
      const updated = await this.prisma.words.update({
        where: { id: existing.id },
        data: { stem, translatedWord },
      });

      return { word: this.wordMapper.toDomain(updated), created: false };
    }

    const created = await this.prisma.words.create({
      data: { word, stem, language, translatedWord },
    });

    return { word: this.wordMapper.toDomain(created), created: true };
  }
}
