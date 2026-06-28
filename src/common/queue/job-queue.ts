export interface JobQueueOpetions {
  delay?: number;
  attempts?: number;
  removeOnComplete?: boolean;
  removeOnFail?: boolean;
}

export interface JobQueue {
  enqueue<T>(
    queue: string,
    payload: T,
    options?: JobQueueOpetions,
  ): Promise<void>;
}

export const IJobQueue = Symbol('IJobQueue');
