import { PostPreviewDto } from '@app/modules/post/dto/post-preview.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'test' })
  username: string;
  @ApiProperty({ example: 0 })
  postCount: number;
  @ApiProperty({ example: 0 })
  subscriberCount: number;
  @ApiProperty({ example: 0 })
  subscriptionCount: number;
  @ApiProperty({ example: 'test' })
  firstName: string | null;
  @ApiProperty({ example: 'test' })
  lastName: string | null;
  @ApiProperty({ example: 'image/user/photo-name.jpeg' })
  photo: string | null;
  @ApiProperty({ example: false })
  isSubscription: boolean;
  @ApiProperty({ type: Date })
  createdAt: Date;
  @ApiProperty({ type: Date })
  updatedAt: Date;
  @ApiProperty({ type: [PostPreviewDto] })
  postPreviews: PostPreviewDto[];
}
