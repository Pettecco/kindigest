import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, Schema } from '@google/generative-ai';
import { LlmProvider } from 'src/dictionary/domain';
import { ILogger } from 'src/common/interfaces/logger';

@Injectable()
export class GeminiProvider implements LlmProvider {
  private readonly genAI: GoogleGenerativeAI;

  constructor(
    @Inject(ILogger)
    private readonly logger: ILogger,
    configService: ConfigService,
  ) {
    const apiKey = configService.getOrThrow<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateStructured<T>(input: {
    prompt: string;
    schema: Schema;
    context?: string;
  }): Promise<T> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: input.schema,
      },
    });

    this.logger.debug('Calling Gemini API');

    const result = await model.generateContent(input.prompt);
    const response = await result.response;
    const text = response.text();

    this.logger.debug('Gemini response received');

    return JSON.parse(text) as T;
  }
}
