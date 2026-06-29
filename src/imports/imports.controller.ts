import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TokenPayloadParam } from '../auth/decorators/token-payload.decorator';
import { CreateImportUseCase } from './use-cases/create-import.use-case';
import { UploadImportResponseDto } from './dto/upload-file.dto';
import { multerOptions } from './infrastructure/upload/multer.config';

@ApiTags('Imports')
@ApiBearerAuth()
@Controller('imports')
@UseGuards(JwtAuthGuard)
export class ImportsController {
  constructor(private readonly createImportUseCase: CreateImportUseCase) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload Kindle vocabulary file' })
  @ApiResponse({ status: 201, description: 'Import created and enqueued for processing.', type: UploadImportResponseDto })
  @ApiResponse({ status: 400, description: 'File is required or invalid format.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async createImport(
    @TokenPayloadParam('sub') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Vocab file is required');
    }

    return this.createImportUseCase.execute({
      userId,
      filePath: file.path,
      originalName: file.originalname,
    });
  }
}
