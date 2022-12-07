import { ProfileEntity } from '@app/modules/profile/profile.entity';
import { PostPreviewDto } from '@app/modules/post/dto/postPreview.dto';

export class ProfileResponseDto {
  profile: ProfileEntity & {
    username: string;
    postCount: number;
    subscriptionsCount: number;
    subscribersCount: number;
  };
  isSubscription: boolean;
  isOwner: boolean;
  posts: PostPreviewDto[];
}
