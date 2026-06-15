import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { LoginUseCase } from './use-cases/login.use-case.js';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case.js';
import { LogoutUseCase } from './use-cases/logout.use-case.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';
import { TokenPayloadParam } from './decorators/token-payload.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private logoutUseCase: LogoutUseCase,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto.email, dto.password);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @TokenPayloadParam('sub') userId: string,
    @TokenPayloadParam('refreshToken') refreshToken: string,
  ) {
    return this.refreshTokenUseCase.execute(userId, refreshToken);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logout(@TokenPayloadParam('sub') userId: string) {
    await this.logoutUseCase.execute(userId);
    return { message: 'Logout successful' };
  }
}
