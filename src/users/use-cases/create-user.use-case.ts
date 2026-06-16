import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { UseCase } from '../../common/interfaces/use-case';
import { IUsersRepository } from '../domain/user-repository';
import type { IUsersRepository as IUsersRepositoryType } from '../domain/user-repository';
import { IHashingServiceSymbol } from '../../auth/hashing/hashing.service';
import type { IHashingService } from '../../auth/hashing/hashing.service';
import { PreferredDisplayMode } from 'generated/prisma/enums';
import { ILogger } from '../../common/interfaces/logger';

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

  async execute({
    email,
    password,
  }: CreateUserInput): Promise<CreateUserOutput> {
    await this.logger.info(`Creating user: ${email}`);

    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await this.hashingService.hash(password);

    const user = await this.usersRepository.create({
      email,
      password: passwordHash,
    });

    await this.logger.info(`User created successfully: ${email}`);

    return user;
  }
}

export class CreateUserInput {
  email: string;
  password: string;
}

export class CreateUserOutput {
  id: string;
  email: string;
  preferredDisplayMode: PreferredDisplayMode;
  createdAt: Date;
}
