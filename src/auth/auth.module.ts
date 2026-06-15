import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller.js';
import { LoginUseCase } from './use-cases/login.use-case.js';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case.js';
import { LogoutUseCase } from './use-cases/logout.use-case.js';
import { UsersModule } from '../users/users.module.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';
import { makeHashingFactory } from '../common/factories/hashing.factory.js';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<number>('jwt.jwtTtl'),
          audience: configService.get<string>('jwt.audience'),
          issuer: configService.get<string>('jwt.issuer'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    makeHashingFactory,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    JwtAuthGuard,
    RefreshTokenGuard,
  ],
  exports: [JwtModule, JwtAuthGuard, RefreshTokenGuard],
})
export class AuthModule {}
