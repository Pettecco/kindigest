import { Injectable } from '@nestjs/common';
import {
  IBooksRepository,
  UpsertBookInput,
} from '../../books/domain/ports/books.repository';
import { Book } from '../../books/domain/entities/book';
import { PrismaService } from '../prisma.service';
import { BookMapper } from '../mappers/book.mapper';

@Injectable()
export class PrismaBooksRepository implements IBooksRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bookMapper: BookMapper,
  ) {}

  async upsertByKindleBookId({
    kindleBookId,
    title,
    author,
  }: UpsertBookInput): Promise<{ book: Book; created: boolean }> {
    const existingBook = await this.prisma.book.findUnique({
      where: { kindleBookId },
    });

    if (existingBook) {
      const updated = await this.prisma.book.update({
        where: { id: existingBook.id },
        data: { title, author },
      });

      return { book: this.bookMapper.toDomain(updated), created: false };
    }

    const created = await this.prisma.book.create({
      data: { kindleBookId, title, author },
    });

    return { book: this.bookMapper.toDomain(created), created: true };
  }
}
