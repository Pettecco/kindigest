import { Injectable } from '@nestjs/common';
import { DomainMapper } from './base.mapper';
import { Book as PrismaBook } from '../../../generated/prisma/client';
import { Book } from '../../books/domain/entities/book';

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
