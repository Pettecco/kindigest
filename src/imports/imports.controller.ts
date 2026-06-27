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
import { CreateImportUseCase } from './use-cases/create-import.use-case';
import { multerOptions } from './upload/multer.config';

@Controller('imports')
@UseGuards(JwtAuthGuard)
export class ImportsController {
  constructor(private readonly createImportUseCase: CreateImportUseCase) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async createImport(
    @TokenPayloadParam('sub') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.createImportUseCase.execute({
      userId,
      filePath: file.path,
      originalName: file.originalname,
    });
  }
}
