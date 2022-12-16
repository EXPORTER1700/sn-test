import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { SubscriptionRepository } from '@app/modules/subscription/subscription.repository';
import { UserEntity } from '@app/modules/user/user.entity';
import { SuccessResponseDto } from '@app/common/dto/success-response.dto';
import { BaseQueryDto } from '@app/common/dto/base-query.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  public async createSubscription(
    user: UserEntity,
    subscriber: UserEntity,
  ): Promise<SuccessResponseDto> {
    const isSubscriptionExist = await this.checkSubscription(
      user.id,
      subscriber.id,
    );

    if (isSubscriptionExist) {
      throw new UnprocessableEntityException('Subscription is already exist');
    }

    return await this.subscriptionRepository.createSubscription(
      user,
      subscriber,
    );
  }

  public async deleteSubscription(
    userId: number,
    subscriberId: number,
  ): Promise<SuccessResponseDto> {
    const subscription =
      await this.subscriptionRepository.findByUserAndSubscriberId(
        userId,
        subscriberId,
      );

    if (!subscription) {
      throw new UnprocessableEntityException('Subscription does not exist');
    }

    return await this.subscriptionRepository.deleteSubscription(subscription);
  }

  public async getSubscriptionsIdsByUserId(
    userId: number,
    query?: BaseQueryDto,
  ) {
    return await this.subscriptionRepository.getSubscriptionsIdsByUserId(
      userId,
      query,
    );
  }

  public async getSubscribersIdsByUserId(userId: number, query?: BaseQueryDto) {
    return await this.subscriptionRepository.getSubscribersIdsByUserId(
      userId,
      query,
    );
  }

  public async checkSubscription(
    userId: number,
    currentUserId: number,
  ): Promise<boolean> {
    const subscription =
      await this.subscriptionRepository.findByUserAndSubscriberId(
        userId,
        currentUserId,
      );

    return Boolean(subscription);
  }
}
