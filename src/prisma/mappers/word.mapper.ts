import { Injectable } from '@nestjs/common';
import { DomainMapper } from './base.mapper';
import { Words as PrismaWord } from '../../../generated/prisma/client';
import { Word } from 'src/common/domain';

@Injectable()
export class WordMapper extends DomainMapper<PrismaWord, Word> {
  toDomain(prisma: PrismaWord): Word {
    return {
      id: prisma.id,
      word: prisma.word,
      stem: prisma.stem,
      language: prisma.language,
      translatedWord: prisma.translatedWord,
    };
  }
}
