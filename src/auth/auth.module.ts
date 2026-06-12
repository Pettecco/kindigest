import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BcryptService } from './hashing/bcrypt.service.js';
import { IHashingService } from './hashing/hashing.service.js';
import { AuthController } from './auth.controller.js';
import { LoginUseCase } from './use-cases/login.use-case.js';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case.js';
import { LogoutUseCase } from './use-cases/logout.use-case.js';
import { UsersModule } from '../users/users.module.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: Number(process.env.JWT_TTL) || 900,
        audience: process.env.JWT_TOKEN_AUDIENCE || 'kindigest',
        issuer: process.env.JWT_TOKEN_ISSUER || 'kindigest',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: IHashingService,
      useClass: BcryptService,
    },
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    JwtAuthGuard,
    RefreshTokenGuard,
  ],
  exports: [IHashingService, JwtModule, JwtAuthGuard, RefreshTokenGuard],
})
export class AuthModule {}
