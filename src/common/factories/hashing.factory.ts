import { Provider } from '@nestjs/common';
import { BcryptService } from '../../auth/hashing/bcrypt.service.js';
import { IHashingServiceSymbol } from '../../auth/hashing/hashing.service.js';

export const makeHashingFactory: Provider = {
  provide: IHashingServiceSymbol,
  useFactory: () => new BcryptService(),
};
