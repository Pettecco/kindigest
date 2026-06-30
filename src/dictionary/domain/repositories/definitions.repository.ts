import { Definition } from '../entities/definition';

export interface CreateDefinitionInput {
  wordId: string;
  definition: string;
  translatedDefinition?: string;
}

export const IDefinitionsRepository = Symbol('IDefinitionsRepository');

export interface IDefinitionsRepository {
  create(input: CreateDefinitionInput): Promise<Definition>;
  findByWordId(wordId: string): Promise<Definition | null>;
}
