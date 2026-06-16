import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { IHashingServiceSymbol } from '../hashing/hashing.service.js';
import { ILogger } from '../../common/interfaces/logger.js';
import type { IHashingService } from '../hashing/hashing.service.js';
import { IUsersRepository } from '../../users/domain/user-repository.js';
import { TokenDto } from '../dto/token.dto.js';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUsersRepository)
    private usersRepository: IUsersRepository,
    @Inject(IHashingServiceSymbol)
    private hashingService: IHashingService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(ILogger)
    private logger: ILogger,
  ) {}

  async execute(email: string, password: string): Promise<TokenDto> {
    await this.logger.info(`Login attempt for: ${email}`);

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashingService.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const audience = this.configService.get<string>('JWT_TOKEN_AUDIENCE');
    const issuer = this.configService.get<string>('JWT_TOKEN_ISSUER');
    const secret = this.configService.get<string>('JWT_SECRET');
    const ttl = this.configService.get<number>('JWT_TTL');
    const refreshTtl = this.configService.get<number>('JWT_REFRESH_TTL');

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        audience,
        issuer,
        secret,
        expiresIn: ttl,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        audience,
        issuer,
        secret,
        expiresIn: refreshTtl,
      },
    );

    const hashedRefreshToken = await this.hashingService.hash(refreshToken);
    await this.usersRepository.updateRefreshToken(user.id, hashedRefreshToken);

    await this.logger.info(`Login successful: ${email}`);

    return { accessToken, refreshToken };
  }
}
