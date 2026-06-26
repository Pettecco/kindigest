import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from 'src/users/domain';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.usersRepository.updateRefreshToken(userId, null);
  }
}
