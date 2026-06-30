import { Injectable } from '@nestjs/common';
import {
  IDefinitionsRepository,
  CreateDefinitionInput,
} from '../../dictionary/domain/repositories/definitions.repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaDefinitionsRepository implements IDefinitionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateDefinitionInput): Promise<any> {
    const definition = await this.prisma.definition.create({
      data: {
        wordId: input.wordId,
        definition: input.definition,
        translatedDefinition: input.translatedDefinition,
      },
    });

    return definition;
  }

  async findByWordId(wordId: string): Promise<any | null> {
    const definition = await this.prisma.definition.findUnique({
      where: { wordId },
    });

    return definition || null;
  }
}
