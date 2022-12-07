import { IsString, Length, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @Length(8, 32)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, {
    message:
      'Password must containing at least 8 characters, 1 number, 1 upper and 1 lowercase.',
  })
  newPassword: string;
}
