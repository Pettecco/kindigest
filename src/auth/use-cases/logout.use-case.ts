import { Inject, Injectable } from '@nestjs/common';
import { IUsersRepository } from '../../users/domain/user-repository';

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
