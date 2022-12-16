import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test' })
  @IsString()
  @Length(4, 50)
  username: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'testTest123' })
  @IsString()
  @Length(8, 32)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, {
    message:
      'Password must containing at least 8 characters, 1 number, 1 upper and 1 lowercase.',
  })
  password: string;
}
