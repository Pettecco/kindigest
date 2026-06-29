import { IJobQueue, JobQueueOptions } from '../../src/common/queue';

export class FakeJobQueue implements IJobQueue {
  enqueuedJobs: { queue: string; payload: unknown; options?: JobQueueOptions }[] = [];

  async enqueue<T>(
    queue: string,
    payload: T,
    options?: JobQueueOptions,
  ): Promise<void> {
    this.enqueuedJobs.push({ queue, payload, options });
  }

  clear(): void {
    this.enqueuedJobs = [];
  }
}
