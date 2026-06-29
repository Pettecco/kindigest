import {
  CreateImportUseCase,
  CreateImportUseCaseInput,
} from '../../../src/imports/use-cases/create-import.use-case';
import { MockImportsRepository } from '../../__mocks__/imports-repository.mock';
import { FakeJobQueue } from '../../__mocks__/job-queue.mock';
import { MockLogger } from '../../__mocks__/logger.mock';
import { ImportStatus } from '../../../generated/prisma/enums';
import { QUEUES } from '../../../src/common/queue';

jest.mock('../../../src/imports/utils/validate-vocab-file', () => ({
  validateVocabFile: jest.fn(),
}));

describe('CreateImportUseCase', () => {
  let useCase: CreateImportUseCase;
  let importsRepository: MockImportsRepository;
  let jobQueue: FakeJobQueue;
  let logger: MockLogger;

  const validInput: CreateImportUseCaseInput = {
    userId: 'user-123',
    filePath: '/tmp/uploads/uuid.vocab.db',
    originalName: 'vocab.db',
  };

  beforeEach(() => {
    importsRepository = new MockImportsRepository();
    jobQueue = new FakeJobQueue();
    logger = new MockLogger();
    useCase = new CreateImportUseCase(logger, importsRepository, jobQueue);
  });

  it('should create import with PENDING status', async () => {
    const result = await useCase.execute(validInput);

    expect(result.importId).toBe('import-id-123');

    const created = await importsRepository.findById({
      id: result.importId,
    });
    expect(created).not.toBeNull();
    expect(created!.status).toBe(ImportStatus.PENDING);
    expect(created!.originalFileName).toBe('vocab.db');
    expect(created!.userId).toBe('user-123');
  });

  it('should enqueue PROCESS_IMPORT job after creating import', async () => {
    await useCase.execute(validInput);

    expect(jobQueue.enqueuedJobs).toHaveLength(1);
    expect(jobQueue.enqueuedJobs[0]).toMatchObject({
      queue: QUEUES.PROCESS_IMPORT,
      payload: {
        importId: 'import-id-123',
        filePath: '/tmp/uploads/uuid.vocab.db',
      },
    });
  });

  it('should return importId', async () => {
    const result = await useCase.execute(validInput);

    expect(result).toEqual({ importId: 'import-id-123' });
  });

  it('should create import before enqueueing job', async () => {
    const callOrder: string[] = [];

    jest.spyOn(importsRepository, 'create').mockImplementation(async input => {
      callOrder.push('create');
      const result = await MockImportsRepository.prototype.create.call(
        importsRepository,
        input,
      );
      return result;
    });

    jest.spyOn(jobQueue, 'enqueue').mockImplementation(async () => {
      await callOrder.push('enqueue');
    });

    await useCase.execute(validInput);

    expect(callOrder).toEqual(['create', 'enqueue']);
  });

  it('should log the import creation', async () => {
    const logSpy = jest.spyOn(logger, 'info');

    await useCase.execute(validInput);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Creating vocabulary import for user user-123'),
    );
  });

  it('should propagate repository errors', async () => {
    jest
      .spyOn(importsRepository, 'create')
      .mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute(validInput)).rejects.toThrow('Database error');
  });

  it('should propagate job queue errors', async () => {
    jest.spyOn(jobQueue, 'enqueue').mockRejectedValue(new Error('Queue error'));

    await expect(useCase.execute(validInput)).rejects.toThrow('Queue error');
  });
});
