import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { UseCase } from '../../common/interfaces/use-case';
import { ILogger } from '../../common/interfaces/logger';
import { IImportsRepository } from '../domain/ports/imports.repository';

@Injectable()
export class UploadVocabFileUseCase implements UseCase<
  CreateImportUseCaseInput,
  void
> {
  constructor(
    @Inject(ILogger)
    private readonly logger: ILogger,
    @Inject(IImportsRepository)
    private readonly importsRepository: IImportsRepository,
  ) {}

  async execute({
    userId,
    filePath,
    originalName,
  }: CreateImportUseCaseInput): Promise<void> {
    this.logger.info('creating import for vocab.db');

    const importRecord = await this.importsRepository.create({
      userId,
    });
  }
}

export interface CreateImportUseCaseInput {
  userId: string;
  filePath: string;
  originalName: string;
}
