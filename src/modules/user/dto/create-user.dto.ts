import { IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(4, 50)
  username: string;

  @IsString()
  @Length(1, 128)
  email: string;

  @IsString()
  @Length(8, 32)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, {
    message:
      'Password must containing at least 8 characters, 1 number, 1 upper and 1 lowercase.',
  })
  password: string;
}
