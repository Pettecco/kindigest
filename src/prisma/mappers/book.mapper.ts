import { Injectable } from '@nestjs/common';
import { DomainMapper } from './base.mapper';
import { Books as PrismaBook } from '../../../generated/prisma/client';
import { Book } from 'src/common/domain';

@Injectable()
export class BookMapper extends DomainMapper<PrismaBook, Book> {
  toDomain(prisma: PrismaBook): Book {
    return {
      id: prisma.id,
      kindleBookId: prisma.kindleBookId,
      title: prisma.title,
      author: prisma.author,
    };
  }
}
