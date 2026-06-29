import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES } from 'src/common/queue';
import { ProcessImportJob } from 'src/imports/jobs/process-import.job';
import { ProcessImportUseCase } from 'src/imports/use-cases';

@Processor(QUEUES.PROCESS_IMPORT)
export class ProcessImportWorker extends WorkerHost {
  constructor(private readonly processImportUseCase: ProcessImportUseCase) {
    super();
  }

  async process(job: Job<ProcessImportJob>): Promise<void> {
    await this.processImportUseCase.execute(job.data);
  }
}
