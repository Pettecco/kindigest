import { Module, forwardRef } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ImportsController } from './imports.controller';
import { CreateImportUseCase } from './use-cases/create-import.use-case';
import { makeLogger } from '../common/factories/logger';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MAX_VOCAB_FILE_SIZE } from './upload/constants';

@Module({
  imports: [
    MulterModule.register({
      limits: { fileSize: MAX_VOCAB_FILE_SIZE },
    }),
    forwardRef(() => AuthModule),
    PrismaModule,
  ],
  controllers: [ImportsController],
  providers: [makeLogger('ImportsModule'), CreateImportUseCase],
})
export class ImportsModule {}
