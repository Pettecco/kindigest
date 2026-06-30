import { Schema } from '@google/generative-ai';

export interface LlmProvider {
  generateStructured<T>(input: {
    prompt: string;
    schema: Schema;
    context?: string;
  }): Promise<T>;
}

export const LlmProvider = Symbol('LlmProvider');
