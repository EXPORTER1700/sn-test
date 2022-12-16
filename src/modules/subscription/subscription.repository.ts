import { SubscriptionEntity } from '@app/modules/subscription/subscription.entity';
import { DataSource, EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '@app/modules/user/user.entity';
import { SuccessResponseDto } from '@app/common/dto/success-response.dto';
import { BaseQueryDto } from '@app/common/dto/base-query.dto';

@EntityRepository()
export class SubscriptionRepository extends Repository<SubscriptionEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(SubscriptionEntity, dataSource.createEntityManager());
  }

  public async createSubscription(
    user: UserEntity,
    subscriber: UserEntity,
  ): Promise<SuccessResponseDto> {
    const subscription = new SubscriptionEntity();
    subscription.user = user;
    subscription.subscriber = subscriber;
    await subscription.save();

    return new SuccessResponseDto();
  }

  public async deleteSubscription(
    subscription: SubscriptionEntity,
  ): Promise<SuccessResponseDto> {
    await subscription.remove();

    return new SuccessResponseDto();
  }

  public async findByUserAndSubscriberId(
    userId: number,
    subscriberId: number,
  ): Promise<SubscriptionEntity | null> {
    return await super.findOne({
      where: { user: { id: userId }, subscriber: { id: subscriberId } },
    });
  }

  public async getSubscriptionsIdsByUserId(
    userId: number,
    query: BaseQueryDto | undefined,
  ): Promise<number[]> {
    const queryBuilder = super
      .createQueryBuilder('subscriptions')
      .loadAllRelationIds()
      .andWhere('subscriptions.subscriber = :id', { id: userId })
      .orderBy('subscriptions.id');

    if (query) {
      queryBuilder.limit(query.limit).offset(query.offset);
    }

    const result = await queryBuilder.getMany();

    return result.map((item) => item.user) as any as number[]; //TODO
  }

  public async getSubscribersIdsByUserId(
    userId: number,
    query: BaseQueryDto | undefined,
  ): Promise<number[]> {
    const queryBuilder = super
      .createQueryBuilder('subscriptions')
      .loadAllRelationIds()
      .andWhere('subscriptions.user = :id', { id: userId })
      .orderBy('subscriptions.id');

    if (query) {
      queryBuilder.limit(query.limit).offset(query.offset);
    }

    const result = await queryBuilder.getMany();

    return result.map((item) => item.subscriber) as any as number[]; //TODO
  }
}
