import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UseCase } from 'src/common/interfaces/use-case';
import { IUsersRepository, User } from 'src/common/domain';
import type { IUsersRepository as IUsersRepositoryType } from 'src/common/domain';
import { FindUserByEmailDto } from '../dto/find-user-by-email.dto';

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
      throw new NotFoundException('User not found');
    }

    return this.toOutputDto(user);
  }

  private toOutputDto(user: User): FindUserByEmailOutput {
    const { passwordHash, hashedRefreshToken, ...output } = user;
    return output;
  }
}

export class FindUserByEmailInput extends FindUserByEmailDto {}
export class FindUserByEmailOutput {
  id: string;
  email: string;
  passwordHash?: string;
  hashedRefreshToken?: string;
  preferredDisplayMode: string;
  createdAt: Date;
}
