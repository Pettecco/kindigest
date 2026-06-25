import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { UseCase } from '../../common/interfaces/use-case';
import { IUsersRepository } from 'src/common/domain';
import type { IUsersRepository as IUsersRepositoryType } from 'src/common/domain';
import { IHashingServiceSymbol } from '../../auth/hashing/hashing.service';
import type { IHashingService } from '../../auth/hashing/hashing.service';
import { PreferredDisplayMode } from 'generated/prisma/enums';
import { ILogger } from '../../common/interfaces/logger';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase implements UseCase<
  CreateUserInput,
  CreateUserOutput
> {
  constructor(
    @Inject(IUsersRepository)
    private usersRepository: IUsersRepositoryType,
    @Inject(IHashingServiceSymbol)
    private hashingService: IHashingService,
    @Inject(ILogger)
    private logger: ILogger,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<CreateUserOutput> {
    await this.logger.info(`Creating user: ${createUserDto.email}`);

    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await this.hashingService.hash(createUserDto.password);

    const user = await this.usersRepository.create({
      email: createUserDto.email,
      password: passwordHash,
    });

    await this.logger.info(`User created successfully: ${createUserDto.email}`);

    return user;
  }
}

export class CreateUserInput extends CreateUserDto {}

export class CreateUserOutput {
  id: string;
  email: string;
  preferredDisplayMode: PreferredDisplayMode;
  createdAt: Date;
}
