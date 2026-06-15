import { Injectable } from '@nestjs/common';
import type { IUsersRepository } from '../../users/domain/user-repository.js';

@Injectable()
export class LogoutUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(userId: string): Promise<void> {
    await this.usersRepository.updateRefreshToken(userId, null);
  }
}
