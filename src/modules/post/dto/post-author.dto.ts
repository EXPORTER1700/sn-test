import { ApiProperty } from '@nestjs/swagger';

export class PostAuthorDto {
  @ApiProperty({ example: 'test' })
  username: string;
  @ApiProperty({ example: 'image/user/photo-name.jpeg' })
  photo: string | null;
}
