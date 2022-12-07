import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserStatusEnum } from '@app/modules/user/types/userStatus.enum';
import { ProfileEntity } from '@app/modules/profile/profile.entity';
import { PostEntity } from '@app/modules/post/post.entity';
import { CommentEntity } from '@app/modules/comment/comment.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  @Exclude({ toPlainOnly: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.NOT_CONFIRMED,
  })
  status: UserStatusEnum;

  @Column({ default: 0 })
  subscriptionsCount: number;

  @Column({ default: 0 })
  subscribersCount: number;

  @Column({ default: 0 })
  postsCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, { eager: true })
  profile: ProfileEntity;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @ManyToMany(() => PostEntity)
  @JoinTable()
  liked: PostEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable()
  subscriptions: UserEntity[];
}
