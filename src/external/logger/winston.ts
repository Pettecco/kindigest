import { ILogOptions } from '../../common/interfaces/log-options.js';
import { ILogger } from '../../common/interfaces/logger.js';
import { createLogger, format, Logger, transports } from 'winston';
import Transport from 'winston-transport';

export class WinstonLogger implements ILogger {
  private logger: Logger;
  private format = format.combine(format.timestamp(), format.prettyPrint());

  constructor(
    service: string,
    fileLogOptions: ILogOptions = { filename: 'error.log', level: 'error' },
    logToConsole = true,
  ) {
    const outputs: Transport[] = [
      new transports.File({
        ...fileLogOptions,
        format: this.format,
      }),
    ];

    if (logToConsole) {
      outputs.push(
        new transports.Console({
          level: 'info',
          format: this.format,
        }),
      );
    }

    this.logger = createLogger({
      format: format.json(),
      defaultMeta: { service: service },
      transports: outputs,
    });
  }

  async debug(message: any): Promise<void> {
    this.logger.debug({ message });
  }

  async error(message: any): Promise<void> {
    this.logger.error({ message });
  }

  async info(message: any): Promise<void> {
    this.logger.info({ message });
  }

  async warn(message: any): Promise<void> {
    this.logger.warn({ message });
  }
}
