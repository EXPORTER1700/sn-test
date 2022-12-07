import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(4, 20)
  username: string;

  @IsEmail()
  email: string;
}
