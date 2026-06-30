import { SchemaType, Schema } from '@google/generative-ai';

export const nonPtSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    definition: {
      type: SchemaType.STRING,
      description: 'Definition of the word in its original language',
    },
    translatedDefinition: {
      type: SchemaType.STRING,
      description: 'Definition translated to Brazilian Portuguese',
    },
    translatedWord: {
      type: SchemaType.STRING,
      description: 'The word translated to Brazilian Portuguese',
    },
  },
  required: ['definition', 'translatedDefinition', 'translatedWord'],
};

export const ptSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    definition: {
      type: SchemaType.STRING,
      description: 'Definição da palavra em português brasileiro',
    },
  },
  required: ['definition'],
};
