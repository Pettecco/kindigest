import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginUseCase } from './use-cases/login.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { LogoutUseCase } from './use-cases/logout.use-case';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { TokenPayloadParam } from './decorators/token-payload.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private logoutUseCase: LogoutUseCase,
  ) {}

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Returns JWT tokens.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto.email, dto.password);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Returns new JWT tokens.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @TokenPayloadParam('sub') userId: string,
    @TokenPayloadParam('refreshToken') refreshToken: string,
  ) {
    return this.refreshTokenUseCase.execute(userId, refreshToken);
  }

  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  @ApiResponse({ status: 200, description: 'Logout successful.' })
  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logout(@TokenPayloadParam('sub') userId: string) {
    await this.logoutUseCase.execute(userId);
    return { message: 'Logout successful' };
  }
}
