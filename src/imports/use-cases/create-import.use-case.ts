import { Injectable, Inject } from '@nestjs/common';
import { UseCase } from '../../common/interfaces/use-case';
import { ILogger } from '../../common/interfaces/logger';
import { IImportsRepository } from '../domain/ports/imports.repository';
import { ImportStatus } from 'generated/prisma/enums';

@Injectable()
export class CreateImportUseCase implements UseCase<
  CreateImportUseCaseInput,
  CreateImportUseCaseOutput
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
  }: CreateImportUseCaseInput): Promise<CreateImportUseCaseOutput> {
    this.logger.info(
      `Creating vocabulary import for user ${userId} (file: ${originalName})`,
    );

    const importRecord = await this.importsRepository.create({
      userId,
      status: ImportStatus.PENDING,
      originalFileName: originalName,
    });

    return { importId: importRecord.id };
  }
}

export interface CreateImportUseCaseInput {
  userId: string;
  filePath: string;
  originalName: string;
}

export interface CreateImportUseCaseOutput {
  importId: string;
}
