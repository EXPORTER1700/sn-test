import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@app/modules/user/user.entity';

@Entity('subscriptions')
export class SubscriptionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.subscribers)
  @JoinColumn({ name: 'user_id1', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.subscriptions)
  @JoinColumn({ name: 'user_id2', referencedColumnName: 'id' })
  subscriber: UserEntity;

  @CreateDateColumn({ name: 'created_at', type: Date, default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: Date, default: new Date() })
  updatedAt: Date;
}
