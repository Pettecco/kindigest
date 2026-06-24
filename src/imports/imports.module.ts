import { Module, forwardRef } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ImportsController } from './imports.controller';
import { UploadVocabFileUseCase } from './use-cases';
import { makeLogger } from '../common/factories/logger';
import { AuthModule } from '../auth/auth.module';
import { MAX_SIZE_UPLOAD } from './constants';

@Module({
  imports: [
    MulterModule.register({
      limits: { fileSize: MAX_SIZE_UPLOAD },
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [ImportsController],
  providers: [makeLogger('ImportsModule'), UploadVocabFileUseCase],
})
export class ImportsModule {}
