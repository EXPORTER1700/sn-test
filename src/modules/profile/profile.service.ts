import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ProfileRepository } from '@app/modules/profile/profile.repository';
import { UserEntity } from '@app/modules/user/user.entity';
import { ProfileResponseDto } from '@app/modules/profile/dto/profileResponse.dto';
import { UserService } from '@app/modules/user/user.service';
import { PostService } from '@app/modules/post/post.service';
import { SearchProfilesQueryInterface } from '@app/modules/profile/types/searchProfilesQuery.interface';
import { ProfilePreviewDto } from '@app/modules/profile/dto/profilePreview.dto';
import { ProfileEntity } from '@app/modules/profile/profile.entity';
import { RedisCacheService } from '@app/modules/redis-cache/redis-cache.service';
import { CacheProfileType } from '@app/modules/profile/types/cacheProfile.type';
import { UpdateProfileDto } from '@app/modules/profile/dto/updateProfile.dto';
import { FileService } from '@app/modules/file/file.service';
import { UploadFileContentTypeEnum } from '@app/modules/file/types/uploadFileContentType.enum';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    private readonly redisCacheService: RedisCacheService,
    private readonly fileService: FileService,
  ) {}

  public async createProfile(user: UserEntity) {
    return await this.profileRepository.createProfile(user);
  }

  public async updateProfile(
    dto: UpdateProfileDto,
    photo: Express.Multer.File | undefined,
    currentUser: UserEntity,
  ) {
    const { profile } = currentUser;
    Object.assign(profile, dto);

    if (photo) {
      const sandData = await this.fileService.uploadFile(
        photo,
        UploadFileContentTypeEnum.USER,
      );

      profile.photo = sandData.Key;
    }

    await profile.save();

    currentUser.profile = profile;

    return await this.buildProfileResponse(currentUser, currentUser);
  }

  public async getProfileByUsername(
    username: string,
    currentUser: UserEntity,
  ): Promise<ProfileResponseDto> {
    const cacheProfile = await this.getProfileFromCache(
      username,
      currentUser.username,
    );

    if (cacheProfile) {
      return cacheProfile;
    }

    const user = await this.userService.findByUsernameWithRelations(username);

    if (!user) {
      throw new UnprocessableEntityException('User does not exist');
    }

    return await this.buildProfileResponse(user, currentUser);
  }

  public async getMe(currentUser: UserEntity): Promise<ProfileResponseDto> {
    const cacheProfile = await this.getProfileFromCache(
      currentUser.username,
      currentUser.username,
    );

    if (cacheProfile) {
      console.log('from cache');
      return cacheProfile;
    }

    return await this.buildProfileResponse(currentUser, currentUser);
  }

  public async subscribe(
    currentUserId: number,
    subscriberUsername: string,
  ): Promise<ProfileResponseDto> {
    const subscriber = await this.userService.findByUsernameWithRelations(
      subscriberUsername,
    );

    if (!subscriber) {
      throw new UnprocessableEntityException('User does not exist');
    }

    const currentUser = (await this.userService.findByIdWithRelations(
      currentUserId,
      ['subscriptions'],
    )) as UserEntity;

    if (!subscriber) {
      throw new UnprocessableEntityException('Subscriber does not exist');
    }

    const isSubscribed = !!currentUser.subscriptions.find(
      (item) => item.id === subscriber.id,
    );

    if (isSubscribed) {
      throw new UnprocessableEntityException('User is already subscribed');
    }

    currentUser.subscriptions.push(subscriber);
    currentUser.subscriptionsCount += 1;
    subscriber.subscribersCount += 1;

    await currentUser.save();
    await subscriber.save();

    await this.saveProfileToCache(currentUser);

    return this.buildProfileResponse(subscriber, currentUser);
  }

  public async unsubscribe(
    currentUserId: number,
    subscriberUsername: string,
  ): Promise<ProfileResponseDto> {
    const currentUser = (await this.userService.findByIdWithRelations(
      currentUserId,
      ['subscriptions'],
    )) as UserEntity;

    const subscriber = await this.userService.findByUsernameWithRelations(
      subscriberUsername,
    );

    if (!subscriber) {
      throw new UnprocessableEntityException('Subscriber does not exist');
    }

    const isSubscribed = !!currentUser.subscriptions.find(
      (item) => item.id === subscriber.id,
    );

    if (!isSubscribed) {
      throw new UnprocessableEntityException('User is not subscribed yet');
    }

    currentUser.subscriptions = currentUser.subscriptions.filter(
      (item) => item.id !== subscriber.id,
    );
    subscriber.subscribersCount -= 1;
    currentUser.subscriptionsCount -= 1;

    await currentUser.save();
    await subscriber.save();

    await this.saveProfileToCache(currentUser);

    return await this.buildProfileResponse(subscriber, currentUser);
  }

  public async buildProfileResponse(
    user: UserEntity,
    currentUser: UserEntity,
  ): Promise<ProfileResponseDto> {
    const cacheProfile = await this.saveProfileToCache(user);

    const isSubscription = await this.checkSubscription(
      user.username,
      currentUser.username,
    );

    const isOwner = user.username === currentUser.username;

    return {
      ...cacheProfile,
      isOwner,
      isSubscription,
    };
  }

  public async saveProfileToCache(user: UserEntity): Promise<CacheProfileType> {
    const posts = await this.postService.getPostPreviews(user.username, {
      limit: 6,
      offset: 0,
    });

    const profileWithPosts = {
      profile: Object.assign(user.profile, {
        username: user.username,
        postCount: user.postsCount,
        subscriptionsCount: user.subscriptionsCount,
        subscribersCount: user.subscribersCount,
      }),
      posts,
    };

    await this.redisCacheService.set(profileWithPosts);

    return profileWithPosts;
  }

  public async searchProfilesByUsername(
    username: string,
    query: SearchProfilesQueryInterface,
  ): Promise<ProfilePreviewDto[]> {
    const queryBuilder = this.profileRepository
      .createQueryBuilder('profiles')
      .leftJoinAndSelect('profiles.user', 'users')
      .andWhere('users.username LIKE :username', { username: `%${username}%` })
      .limit(query.limit)
      .offset(query.offset);

    const profiles = await queryBuilder.getMany();

    return profiles.map((profile) => this.buildProfilePreview(profile));
  }

  private buildProfilePreview(profile: ProfileEntity): ProfilePreviewDto {
    return {
      username: profile.user.username,
      firstName: profile.firstName,
      lastName: profile.lastName,
      photo: profile.photo,
    };
  }

  private async checkSubscription(
    username: string,
    currentUserUsername: string,
  ): Promise<boolean> {
    const currentUser = await this.userService.findByUsernameWithRelations(
      currentUserUsername,
      ['subscriptions'],
    );

    if (!currentUser) {
      throw new UnprocessableEntityException('User does not exist');
    }

    return !!currentUser.subscriptions.find(
      (user) => user.username === username,
    );
  }

  private async getProfileFromCache(
    username: string,
    currentUserUsername: string,
  ): Promise<ProfileResponseDto | null> {
    const cacheProfile = await this.redisCacheService.get(username);

    if (!cacheProfile) {
      return null;
    }

    const isSubscription = await this.checkSubscription(
      username,
      currentUserUsername,
    );
    const isOwner = username === currentUserUsername;

    return Object.assign(cacheProfile, { isSubscription, isOwner });
  }
}
