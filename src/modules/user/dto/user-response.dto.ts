import { PostPreviewDto } from '@app/modules/post/dto/post-preview.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ProfileEntity } from '@app/modules/profile/profile.entity';

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

  @ApiProperty({ type: ProfileEntity })
  profile: ProfileEntity;

  @ApiProperty({ example: false })
  isSubscription: boolean;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: [PostPreviewDto] })
  postPreviews: PostPreviewDto[];
}
