import { ILogger } from '../../src/common/interfaces/logger';

export class MockLogger implements ILogger {
  async info(message: string): Promise<void> {}
  async warn(message: string): Promise<void> {}
  async error(message: string): Promise<void> {}
  async debug(message: string): Promise<void> {}
}
