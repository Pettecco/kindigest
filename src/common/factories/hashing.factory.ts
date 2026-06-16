import { Provider } from '@nestjs/common';
import { BcryptService } from '../../auth/hashing/bcrypt.service';
import { IHashingServiceSymbol } from '../../auth/hashing/hashing.service';

export const makeHashingFactory: Provider = {
  provide: IHashingServiceSymbol,
  useFactory: () => new BcryptService(),
};
