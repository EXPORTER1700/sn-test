import { ApiProperty } from '@nestjs/swagger';

export class UserPreviewDto {
  @ApiProperty({ example: 'test' })
  username: string;
  @ApiProperty({ example: 'image/user/photo-name.jpeg' })
  photo: string;
  @ApiProperty({ example: true })
  isSubscription: boolean;
}
