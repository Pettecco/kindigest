import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { LoginUseCase } from './use-cases/login.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { LogoutUseCase } from './use-cases/logout.use-case';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { makeHashingFactory } from '../common/factories/hashing.factory';
import { makeLogger } from '../common/factories/logger';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_TTL'),
          audience: configService.get<string>('JWT_TOKEN_AUDIENCE'),
          issuer: configService.get<string>('JWT_TOKEN_ISSUER'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    makeHashingFactory,
    makeLogger('AuthModule'),
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    JwtAuthGuard,
    RefreshTokenGuard,
  ],
  exports: [JwtModule, JwtAuthGuard, RefreshTokenGuard],
})
export class AuthModule {}
