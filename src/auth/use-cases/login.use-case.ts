import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { IHashingServiceSymbol } from '../hashing/hashing.service';
import { ILogger } from '../../common/interfaces/logger';
import type { IHashingService } from '../hashing/hashing.service';
import { IUsersRepository } from 'src/users/domain';
import { TokenDto } from '../dto/token.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
    @Inject(IHashingServiceSymbol)
    private readonly hashingService: IHashingService,
    @Inject(ILogger)
    private readonly logger: ILogger,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
