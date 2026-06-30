import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILogger } from '../interfaces/logger';
import { LlmProvider } from 'src/dictionary/domain';
import { GeminiProvider } from 'src/dictionary/infrastructure/providers';

export const makeLlmFactory: Provider = {
  provide: LlmProvider,
  inject: [ConfigService, ILogger],
  useFactory: (configService: ConfigService, logger: ILogger) => {
    return new GeminiProvider(logger, configService);
  },
};
