import { ILogger } from '../../src/common/interfaces/logger';

export class MockLogger implements ILogger {
  info(message: string): void {}
  warn(message: string): void {}
  error(message: string): void {}
  debug(message: string): void {}
}
