import { ProfileResponseDto } from '@app/modules/profile/dto/profileResponse.dto';

export type CacheProfileType = Omit<
  ProfileResponseDto,
  'isOwner' | 'isSubscription'
>;
