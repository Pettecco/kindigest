import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { PreferredDisplayMode } from 'generated/prisma/enums';
import { UseCase } from 'src/common/interfaces';
import { IUsersRepository, User } from 'src/common/domain';
import { ILogger } from 'src/common/interfaces/logger';

export class UpdatePreferredDisplayModeUseCase implements UseCase<
  UpdatePreferredDisplayModeInput,
  UpdatePreferredDisplayModeOutput
> {
  constructor(
    @Inject(IUsersRepository)
    private readonly userRepository: IUsersRepository,
    @Inject(ILogger)
    private readonly logger: ILogger,
  ) {}

  async execute({
    preferredDisplayMode,
    userId,
    requesterId,
  }: UpdatePreferredDisplayModeInput): Promise<UpdatePreferredDisplayModeOutput> {
    this.logger.info('Updating preferred display mode');

    const isSameUser = requesterId === userId;

    if (!isSameUser) {
      throw new ForbiddenException('User does not have permission');
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userRepository.updatePreferredDisplayMode(
      userId,
      preferredDisplayMode,
    );

    return this.toOutputDto(updatedUser);
  }

  private toOutputDto(user: User): UpdatePreferredDisplayModeOutput {
    const { passwordHash, hashedRefreshToken, ...output } = user;
    return output;
  }
}

export class UpdatePreferredDisplayModeInput {
  preferredDisplayMode: PreferredDisplayMode;
  requesterId: string;
  userId: string;
}

export class UpdatePreferredDisplayModeOutput {
  id: string;
  email: string;
  preferredDisplayMode: string;
  createdAt: Date;
}
