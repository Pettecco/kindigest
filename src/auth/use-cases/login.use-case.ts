import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IHashingService } from '../hashing/hashing.service.js';
import { IUsersRepository } from '../../users/domain/user-repository.js';
import { TokenDto } from '../dto/token.dto.js';

@Injectable()
export class LoginUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private hashingService: IHashingService,
    private jwtService: JwtService,
  ) {}

  async execute(email: string, password: string): Promise<TokenDto> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Usuário não autorizado');
    }

    const isPasswordValid = await this.hashingService.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida!');
    }

    const accessToken = await this.signJwtAsync(
      user.id,
      Number(process.env.JWT_TTL) || 900,
      { email: user.email },
    );

    const refreshToken = await this.signJwtAsync(
      user.id,
      Number(process.env.JWT_REFRESH_TTL) || 604800,
    );

    await this.usersRepository.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
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
