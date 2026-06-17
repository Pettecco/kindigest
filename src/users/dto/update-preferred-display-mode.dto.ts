import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PreferredDisplayMode } from 'generated/prisma/enums';

export class UpdatePreferredDisplayModeBodyDto {
  @ApiProperty({
    description: 'Preferred display mode',
    example: PreferredDisplayMode.TRANSLATED,
    enum: PreferredDisplayMode,
  })
  @IsEnum(PreferredDisplayMode)
  preferredDisplayMode: PreferredDisplayMode;
}
