import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UseCase } from 'src/common/interfaces/use-case';
import { IUsersRepository, User } from '../domain';
import type { IUsersRepository as IUsersRepositoryType } from '../domain';
import { FindUserByIdDto } from '../dto/find-user-by-id.dto';

@Injectable()
export class FindUserByIdUseCase implements UseCase<
  FindUserByIdInput,
  FindUserByIdOutput
> {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepositoryType,
  ) {}

  async execute({ id }: FindUserByIdInput): Promise<FindUserByIdOutput> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toOutputDto(user);
  }

  private toOutputDto(user: User): FindUserByIdOutput {
    const { passwordHash, hashedRefreshToken, ...output } = user;
    return output;
  }
}

export class FindUserByIdInput extends FindUserByIdDto {}
export class FindUserByIdOutput {
  id: string;
  email: string;
  passwordHash?: string;
  hashedRefreshToken?: string;
  preferredDisplayMode: string;
  createdAt: Date;
}
