export interface ILogger {
  debug(message: string): Promise<void>;
  error(message: string): Promise<void>;
  info(message: string): Promise<void>;
  warn(message: string): Promise<void>;
}

export const ILogger = Symbol('ILogger');
