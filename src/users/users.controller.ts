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
import { WithDocs } from 'nestjs-docfy';
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

@WithDocs()
@Controller('users')
export class UsersController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly updatePreferredDisplayModeUseCase: UpdatePreferredDisplayModeUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.findUserByIdUseCase.execute({ id });
  }

  @Post('email')
  @UseGuards(JwtAuthGuard)
  async findUserByEmail(@Body() dto: FindUserByEmailDto) {
    return this.findUserByEmailUseCase.execute(dto);
  }

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
