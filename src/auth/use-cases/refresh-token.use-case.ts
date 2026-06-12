import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUsersRepository } from '../../users/domain/user-repository.js';
import { TokenDto } from '../dto/token.dto.js';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private jwtService: JwtService,
    private usersRepository: IUsersRepository,
  ) {}

  async execute(userId: string, refreshToken: string): Promise<TokenDto> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (!user.hashedRefreshToken) {
      throw new UnauthorizedException('Refresh token não encontrado');
    }

    await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_SECRET,
      audience: process.env.JWT_TOKEN_AUDIENCE || 'kindigest',
      issuer: process.env.JWT_TOKEN_ISSUER || 'kindigest',
    });

    const accessToken = await this.signJwtAsync(
      user.id,
      Number(process.env.JWT_TTL) || 900,
      { email: user.email },
    );

    const newRefreshToken = await this.signJwtAsync(
      user.id,
      Number(process.env.JWT_REFRESH_TTL) || 604800,
    );

    await this.usersRepository.updateRefreshToken(user.id, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  private async signJwtAsync<T>(
    sub: string,
    expiresIn: number,
    payload?: T,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        audience: process.env.JWT_TOKEN_AUDIENCE || 'kindigest',
        issuer: process.env.JWT_TOKEN_ISSUER || 'kindigest',
        secret: process.env.JWT_SECRET,
        expiresIn,
      },
    );
  }
}
