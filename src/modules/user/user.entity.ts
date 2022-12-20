import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { UserStatusEnum } from '@app/modules/user/types/user-status.enum';
import { ProfileEntity } from '@app/modules/profile/profile.entity';
import { Exclude } from 'class-transformer';
import { PostEntity } from '@app/modules/post/post.entity';
import { LikeEntity } from '@app/modules/like/like.entity';
import { SubscriptionEntity } from '@app/modules/subscription/subscription.entity';
import { CommentEntity } from '@app/modules/comment/comment.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 36, nullable: false })
  @Index()
  username: string;

  @Column({ type: 'varchar', length: 128, nullable: false })
  @Exclude({ toPlainOnly: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 128, nullable: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ name: 'post_count', type: 'int', default: 0, nullable: false })
  postCount: number;

  @Column({
    name: 'subscription_count',
    type: 'int',
    default: 0,
    nullable: false,
  })
  subscriptionCount: number;

  @Column({
    name: 'subscriber_count',
    type: 'int',
    default: 0,
    nullable: false,
  })
  subscriberCount: number;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.NOT_CONFIRMED,
  })
  status: UserStatusEnum;

  @OneToOne(() => ProfileEntity, (profile) => profile.user)
  profile: ProfileEntity;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  liked: LikeEntity[];

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.user)
  subscribers: SubscriptionEntity[];

  @OneToMany(
    () => SubscriptionEntity,
    (subscription) => subscription.subscriber,
  )
  subscriptions: SubscriptionEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @CreateDateColumn({ name: 'created_at', type: Date, default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: Date, default: new Date() })
  updatedAt: Date;
}
