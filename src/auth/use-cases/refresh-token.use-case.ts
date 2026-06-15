import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { IHashingServiceSymbol } from '../hashing/hashing.service.js';
import type { IHashingService } from '../hashing/hashing.service.js';
import type { IUsersRepository } from '../../users/domain/user-repository.js';
import { TokenDto } from '../dto/token.dto.js';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private jwtService: JwtService,
    private usersRepository: IUsersRepository,
    private configService: ConfigService,
    @Inject(IHashingServiceSymbol)
    private hashingService: IHashingService,
  ) {}

  async execute(userId: string, refreshToken: string): Promise<TokenDto> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.hashedRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const audience = this.configService.get<string>('jwt.audience');
    const issuer = this.configService.get<string>('jwt.issuer');
    const secret = this.configService.get<string>('jwt.secret');
    const ttl = this.configService.get<number>('jwt.jwtTtl');
    const refreshTtl = this.configService.get<number>('jwt.jwtRefreshTtl');

    await this.jwtService.verifyAsync(refreshToken, {
      secret,
      audience,
      issuer,
    });

    const isRefreshTokenValid = await this.hashingService.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        audience,
        issuer,
        secret,
        expiresIn: ttl,
      },
    );

    const newRefreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        audience,
        issuer,
        secret,
        expiresIn: refreshTtl,
      },
    );

    const hashedNewRefreshToken =
      await this.hashingService.hash(newRefreshToken);
    await this.usersRepository.updateRefreshToken(
      user.id,
      hashedNewRefreshToken,
    );

    return { accessToken, refreshToken: newRefreshToken };
  }
}
