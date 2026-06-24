import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from 'src/common/domain';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(IUsersRepository)
    private usersRepository: IUsersRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.usersRepository.updateRefreshToken(userId, null);
  }
}
