import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'test' })
  username: string;
  @ApiProperty({ example: 'testTest123' })
  password: string;
}
