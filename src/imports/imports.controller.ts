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
import { UploadVocabFileUseCase } from './use-cases';

@Controller('imports')
@UseGuards(JwtAuthGuard)
export class ImportsController {
  constructor(
    private readonly uploadVocabFileUseCase: UploadVocabFileUseCase,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @TokenPayloadParam('sub') userId: string,
    @UploadedFile()
    file: { buffer: Buffer; originalname: string; mimetype: string },
  ) {
    return this.uploadVocabFileUseCase
      .execute
      // {
      //   userId,
      //   file,
      // }
      ();
  }
}
