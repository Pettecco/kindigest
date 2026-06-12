import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../common/interfaces/use-case.js';
import { IUsersRepository } from '../domain/user-repository.js';
import { IHashingService } from '../../auth/hashing/hashing.service.js';
import { PreferredDisplayMode } from 'generated/prisma/enums.js';

@Injectable()
export class CreateUserUseCase implements UseCase<
  CreateUserInput,
  CreateUserOutput
> {
  constructor(
    @Inject(IUsersRepository)
    private usersRepository: IUsersRepository,
    @Inject(IHashingService)
    private hashingService: IHashingService,
  ) {}

  async execute({
    email,
    password,
  }: CreateUserInput): Promise<CreateUserOutput> {
    const passwordHash = await this.hashingService.hash(password);

    const user = await this.usersRepository.create({
      email,
      password: passwordHash,
    });

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
