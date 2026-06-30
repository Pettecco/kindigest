import { Injectable } from '@nestjs/common';
import {
  IWordsRepository,
  UpsertWordInput,
} from '../../words/domain/ports/words.repository';
import { Word } from '../../words/domain/entities/word';
import { PrismaService } from '../prisma.service';
import { WordMapper } from '../mappers/word.mapper';

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
    const existing = await this.prisma.word.findUnique({
      where: { word_language: { word, language } },
    });

    if (existing) {
      const updated = await this.prisma.word.update({
        where: { id: existing.id },
        data: { stem, translatedWord },
      });

      return { word: this.wordMapper.toDomain(updated), created: false };
    }

    const created = await this.prisma.word.create({
      data: { word, stem, language, translatedWord },
    });

    return { word: this.wordMapper.toDomain(created), created: true };
  }

  async findById(id: string): Promise<Word | null> {
    const word = await this.prisma.word.findUnique({ where: { id } });
    return word ? this.wordMapper.toDomain(word) : null;
  }

  async update({
    id,
    translatedWord,
  }: {
    id: string;
    translatedWord: string | null;
  }): Promise<Word> {
    const word = await this.prisma.word.update({
      where: { id },
      data: { translatedWord },
    });
    return this.wordMapper.toDomain(word);
  }
}
