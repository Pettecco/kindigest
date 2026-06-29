import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { IJobQueue, JobQueueOptions, QUEUES } from 'src/common/queue';

@Injectable()
export class BullMQJobQueue implements IJobQueue {
  private readonly queues = new Map<string, Queue>();

  constructor(
    @InjectQueue(QUEUES.PROCESS_IMPORT)
    private readonly processImportQueue: Queue,
  ) {
    this.queues.set(QUEUES.PROCESS_IMPORT, this.processImportQueue);
  }

  async enqueue<T>(
    queue: string,
    payload: T,
    options?: JobQueueOptions,
  ): Promise<void> {
    const q = this.queues.get(queue);

    if (!q) {
      throw new Error(`Queue "${queue}" is not registered`);
    }

    await q.add(queue, payload, {
      delay: options?.delay,
      attempts: options?.attempts,
      removeOnComplete: options?.removeOnComplete ?? true,
      removeOnFail: options?.removeOnFail ?? false,
    });
  }
}
