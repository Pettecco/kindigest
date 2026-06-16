import { Provider } from '@nestjs/common';
import { ILogger } from '../interfaces/logger';
import { WinstonLogger } from '../../external/logger/winston';

export const makeLogger = (service: string): Provider => {
  return {
    provide: ILogger,
    useFactory: (): ILogger => {
      return new WinstonLogger(service);
    },
  };
};
