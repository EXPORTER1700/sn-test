import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmailDto {
  @ApiProperty({ example: 'test@gmail.com' })
  email: string;
  @ApiProperty({ example: 'testTest123' })
  password: string;
}
