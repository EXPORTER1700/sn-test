import { PostPreviewDto } from '@app/modules/post/dto/post-preview.dto';

export class UserResponseDto {
  id: number;
  username: string;
  postCount: number;
  subscriberCount: number;
  subscriptionCount: number;
  firstName: string;
  lastName: string;
  photo: string;
  isSubscription: boolean;
  createdAt: Date;
  updatedAt: Date;
  postPreviews: PostPreviewDto[];
}
