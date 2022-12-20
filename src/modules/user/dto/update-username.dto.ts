import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsernameDto {
  @ApiProperty({ example: 'testNew' })
  newUsername: string;
  @ApiProperty({ example: 'testTest123' })
  password: string;
}
