import { IsNotEmpty, IsString } from 'class-validator';

export class FindUserByIdDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
