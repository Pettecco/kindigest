import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateUserDto,
  FindUserByEmailDto,
  UpdatePreferredDisplayModeBodyDto,
} from './dto/index';
import {
  CreateUserUseCase,
  FindUserByEmailUseCase,
  FindUserByIdUseCase,
  UpdatePreferredDisplayModeUseCase,
} from './use-cases/index';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayloadParam } from 'src/auth/decorators/token-payload.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly updatePreferredDisplayModeUseCase: UpdatePreferredDisplayModeUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created.' })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @ApiOperation({ summary: 'Find user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.findUserByIdUseCase.execute({ id });
  }

  @ApiOperation({ summary: 'Find user by email' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth()
  @Post('email')
  @UseGuards(JwtAuthGuard)
  async findUserByEmail(@Body() dto: FindUserByEmailDto) {
    return this.findUserByEmailUseCase.execute(dto);
  }

  @ApiOperation({ summary: 'Update preferred display mode' })
  @ApiResponse({ status: 200, description: 'Display mode updated.' })
  @ApiResponse({ status: 403, description: 'Not allowed to update another user.' })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updatePreferredDisplayMode(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePreferredDisplayModeBodyDto,
    @TokenPayloadParam('sub') requesterId: string,
  ) {
    return this.updatePreferredDisplayModeUseCase.execute({
      userId: id,
      requesterId,
      preferredDisplayMode: dto.preferredDisplayMode,
    });
  }
}
