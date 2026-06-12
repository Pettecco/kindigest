import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}
