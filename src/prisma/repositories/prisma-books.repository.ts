import { Injectable } from '@nestjs/common';
import { IBooksRepository, Book } from 'src/common/domain';
import { PrismaService } from '../prisma.service';
import { BookMapper } from '../mappers';

@Injectable()
export class PrismaBooksRepository implements IBooksRepository {
  constructor(
    private prisma: PrismaService,
    private bookMapper: BookMapper,
  ) {}

  async upsertByKindleBookId(data: {
    kindleBookId: string;
    title: string;
    author: string;
  }): Promise<{ book: Book; created: boolean }> {
    const existing = await this.prisma.books.findUnique({
      where: { kindleBookId: data.kindleBookId },
    });

    if (existing) {
      const updated = await this.prisma.books.update({
        where: { id: existing.id },
        data: {
          title: data.title,
          author: data.author,
        },
      });

      return { book: this.bookMapper.toDomain(updated), created: false };
    }

    const created = await this.prisma.books.create({
      data: {
        kindleBookId: data.kindleBookId,
        title: data.title,
        author: data.author,
      },
    });

    return { book: this.bookMapper.toDomain(created), created: true };
  }
}
