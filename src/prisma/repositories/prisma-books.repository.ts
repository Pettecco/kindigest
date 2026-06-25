import { Injectable } from '@nestjs/common';
import { IBooksRepository, Book, UpsertBookInput } from 'src/common/domain';
import { PrismaService } from '../prisma.service';
import { BookMapper } from '../mappers';

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
    const existingBook = await this.prisma.books.findUnique({
      where: { kindleBookId },
    });

    if (existingBook) {
      const updated = await this.prisma.books.update({
        where: { id: existingBook.id },
        data: { title, author },
      });

      return { book: this.bookMapper.toDomain(updated), created: false };
    }

    const created = await this.prisma.books.create({
      data: { kindleBookId, title, author },
    });

    return { book: this.bookMapper.toDomain(created), created: true };
  }
}
