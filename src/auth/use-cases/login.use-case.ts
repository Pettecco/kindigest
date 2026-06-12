import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { IHashingService } from '../hashing/hashing.service.js';
import { IUsersRepository } from '../../users/domain/user-repository.js';
import { TokenDto } from '../dto/token.dto.js';
import jwtConfig from '../config/jwt.config.js';

@Injectable()
export class LoginUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private hashingService: IHashingService,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
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
      this.jwtConfiguration.jwtTtl,
      { email: user.email },
    );

    const refreshToken = await this.signJwtAsync(
      user.id,
      this.jwtConfiguration.jwtRefreshTtl,
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
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
