import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { WithDocs } from 'nestjs-docfy';
import { CreateUserDto, FindUserByEmailDto } from './dto/index';
import {
  CreateUserUseCase,
  FindUserByEmailUseCase,
  FindUserByIdUseCase,
} from './use-cases/index';

@WithDocs()
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
    return this.findUserByIdUseCase.execute({ id });
  }

  @Post('email')
  async findUserByEmail(@Body() dto: FindUserByEmailDto) {
    return this.findUserByEmailUseCase.execute(dto);
  }
}
