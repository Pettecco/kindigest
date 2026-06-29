export interface JobQueueOptions {
  delay?: number;
  attempts?: number;
  removeOnComplete?: boolean;
  removeOnFail?: boolean;
}

export interface IJobQueue {
  enqueue<T>(
    queue: string,
    payload: T,
    options?: JobQueueOptions,
  ): Promise<void>;
}

export const IJobQueue = Symbol('IJobQueue');
