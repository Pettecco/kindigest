import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UseCase } from 'src/common/interfaces/use-case.js';
import { User } from '../domain/user.js';
import { IUsersRepository } from '../domain/user-repository.js';
import type { IUsersRepository as IUsersRepositoryType } from '../domain/user-repository.js';

@Injectable()
export class FindUserByIdUseCase implements UseCase<string, User> {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepositoryType,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }
}
