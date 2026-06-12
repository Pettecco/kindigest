import { Module } from '@nestjs/common';
import { BcryptService } from './hashing/bcrypt.service.js';
import { IHashingService } from './hashing/hashing.service.js';

@Module({
  providers: [
    {
      provide: IHashingService,
      useClass: BcryptService,
    },
  ],
  exports: [IHashingService],
})
export class AuthModule {}
