import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from '@app/modules/user/user.repository';
import { CreateUserDto } from '@app/modules/user/dto/create-user.dto';
import { UserEntity } from '@app/modules/user/user.entity';
import { hash } from 'bcrypt';
import { ProfileService } from '@app/modules/profile/profile.service';
import { UserStatusEnum } from '@app/modules/user/types/user-status.enum';
import { PostService } from '@app/modules/post/post.service';
import { defaultPostPreviewCountConstant } from '@app/modules/user/types/default-post-preview-count.constant';
import { UserResponseDto } from '@app/modules/user/dto/user-response.dto';
import { SuccessResponseDto } from '@app/common/dto/success-response.dto';
import { SubscriptionService } from '@app/modules/subscription/subscription.service';
import { UserPreviewDto } from '@app/modules/user/dto/user-preview.dto';
import { BaseQueryDto } from '@app/common/dto/base-query.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileService: ProfileService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  public async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const existUser = await this.userRepository.findByEmailOrUsername(
      dto.email,
      dto.username,
    );

    if (existUser) {
      throw new UnprocessableEntityException('User is already exist');
    }

    const hashPassword = await this.hashPassword(dto.password);

    const user = await this.userRepository.createUser({
      ...dto,
      password: hashPassword,
    });

    await this.profileService.createProfile(user);

    return user;
  }

  public async getOneUserByUsername(username: string, currentUserId: number) {
    const user = await this.findByUsernameOrThrowError(username);

    const currentUser = await this.findByIdOrThrowError(currentUserId);

    return await this.buildUserResponseDto(user, currentUser);
  }

  public async getCurrentUser(currentUserId: number) {
    const currentUser = await this.findByIdOrThrowError(currentUserId);

    return await this.buildUserResponseDto(currentUser);
  }

  public async activateUser(id: number): Promise<UserEntity> {
    const user = await this.findByIdOrThrowError(id);

    user.status = UserStatusEnum.ACTIVATED;
    return await user.save();
  }

  public async subscribeToUser(
    username: string,
    currentUserId: number,
  ): Promise<SuccessResponseDto> {
    const user = await this.findByUsernameOrThrowError(username);
    const currentUser = await this.findByIdOrThrowError(currentUserId);
    await this.subscriptionService.createSubscription(user, currentUser);

    user.subscriberCount += 1;
    await user.save();

    currentUser.subscriptionCount += 1;
    await currentUser.save();

    return new SuccessResponseDto();
  }

  public async unsubscribeFromUser(
    username: string,
    currentUserId: number,
  ): Promise<SuccessResponseDto> {
    const user = await this.findByUsernameOrThrowError(username); //TODO Create index to username
    const currentUser = await this.findByIdOrThrowError(currentUserId);
    await this.subscriptionService.deleteSubscription(user.id, currentUser.id);

    user.subscriberCount -= 1;
    await user.save();

    currentUser.subscriptionCount -= 1;
    await currentUser.save();

    return new SuccessResponseDto();
  }

  public async getSubscribersByUsername(
    username: string,
    currentUserId: number,
    query: BaseQueryDto,
  ): Promise<UserPreviewDto[]> {
    const user = await this.findByUsernameOrThrowError(username);
    const subscribersIds =
      await this.subscriptionService.getSubscribersIdsByUserId(user.id, query);

    if (!subscribersIds.length) return [];

    const subscribers = await this.userRepository.getUsersByIds(subscribersIds);

    return await Promise.all(
      subscribers.map(
        async (user) => await this.buildUserPreviewDto(user, currentUserId),
      ),
    );
  }

  public async getSubscriptionsByUsername(
    username: string,
    currentUserId: number,
    query: BaseQueryDto,
  ): Promise<UserPreviewDto[]> {
    const user = await this.findByUsernameOrThrowError(username);
    const subscriptionsIds =
      await this.subscriptionService.getSubscriptionsIdsByUserId(
        user.id,
        query,
      );

    if (!subscriptionsIds.length) return [];

    const subscriptions = await this.userRepository.getUsersByIds(
      subscriptionsIds,
    );

    return await Promise.all(
      subscriptions.map(
        async (user) => await this.buildUserPreviewDto(user, currentUserId),
      ),
    );
  }

  public async findByUsername(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findByUsername(username);
  }

  public async findById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findById(id);
  }

  public async findByIdOrThrowError(userId: number): Promise<UserEntity> {
    const user = await this.findById(userId);

    if (!user) {
      throw new UnprocessableEntityException('User does not exist');
    }

    return user;
  }

  public async findByUsernameOrThrowError(
    username: string,
  ): Promise<UserEntity> {
    const user = await this.findByUsername(username);

    if (!user) {
      throw new UnprocessableEntityException('User does not exist');
    }

    return user;
  }

  private async buildUserResponseDto(
    user: UserEntity,
    currentUser?: UserEntity,
  ): Promise<UserResponseDto> {
    const profile = await this.profileService.findByUserIdOrThrowError(user.id);
    const postPreviews = await this.postService.getPostPreviewsByUsername(
      user.username,
      { limit: defaultPostPreviewCountConstant, offset: 0 },
    );
    const isSubscription = currentUser
      ? await this.subscriptionService.checkSubscription(
          user.id,
          currentUser.id,
        )
      : false;

    return {
      id: user.id,
      username: user.username,
      postCount: user.postCount,
      subscriberCount: user.subscriberCount,
      subscriptionCount: user.subscriptionCount,
      firstName: profile.firstName,
      lastName: profile.lastName,
      photo: profile.photo,
      isSubscription,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      postPreviews,
    };
  }

  private async buildUserPreviewDto(
    user: UserEntity,
    currentUserId: number,
  ): Promise<UserPreviewDto> {
    const profile = await this.profileService.findByUserIdOrThrowError(user.id);
    const isSubscription = await this.subscriptionService.checkSubscription(
      user.id,
      currentUserId,
    );
    return {
      username: user.username,
      photo: profile.photo,
      isSubscription,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }
}
