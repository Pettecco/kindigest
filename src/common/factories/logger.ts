import { Provider } from '@nestjs/common';
import { ILogger } from '../interfaces/logger.js';
import { WinstonLogger } from '../../external/logger/winston.js';

export const makeLogger = (service: string): Provider => {
  return {
    provide: ILogger,
    useFactory: (): ILogger => {
      return new WinstonLogger(service);
    },
  };
};
