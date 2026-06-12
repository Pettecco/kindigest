import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateUserDto, FindUserByEmailDto } from './dto/index.js';
import {
  CreateUserUseCase,
  FindUserByEmailUseCase,
  FindUserByIdUseCase,
} from './use-cases/index.js';

@Controller('users')
export class UsersController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @Get(':id')
  async findUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.findUserByIdUseCase.execute(id);
  }

  @Post('email')
  async findUserByEmail(@Body() dto: FindUserByEmailDto) {
    return this.findUserByEmailUseCase.execute(dto);
  }
}
