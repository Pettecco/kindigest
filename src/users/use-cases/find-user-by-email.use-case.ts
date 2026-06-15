import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UseCase } from 'src/common/interfaces/use-case.js';
import { CreateUserOutput } from './create-user.use-case.js';
import { IUsersRepository } from '../domain/user-repository.js';
import type { IUsersRepository as IUsersRepositoryType } from '../domain/user-repository.js';
import { FindUserByEmailDto } from '../dto/find-user-by-email.dto.js';

@Injectable()
export class FindUserByEmailUseCase implements UseCase<
  FindUserByEmailInput,
  FindUserByEmailOutput
> {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepositoryType,
  ) {}

  async execute({
    email,
  }: FindUserByEmailInput): Promise<FindUserByEmailOutput> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }
}

export class FindUserByEmailInput extends FindUserByEmailDto {}
export class FindUserByEmailOutput extends CreateUserOutput {}
