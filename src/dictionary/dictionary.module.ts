import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from 'src/common/queue';
import { makeLlmFactory } from '../common/factories';
import { GeminiProvider } from './infrastructure/providers/gemini-provider';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.FETCH_DEFINITION,
    }),
  ],
  providers: [
    makeLlmFactory,
    GeminiProvider,
  ],
  exports: [LlmProvider],
})
export class DictionaryModule {}
