import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TokenPayloadParam } from '../auth/decorators/token-payload.decorator';
import { UploadVocabFileUseCase } from './use-cases/create-import.use-case';
import { multerOptions } from './upload/multer.config';

@Controller('imports')
@UseGuards(JwtAuthGuard)
export class ImportsController {
  constructor(
    private readonly uploadVocabFileUseCase: UploadVocabFileUseCase,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(
    @TokenPayloadParam('sub') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadVocabFileUseCase.execute({
      userId,
      filePath: file.path,
      originalName: file.originalname,
    });
  }
}
