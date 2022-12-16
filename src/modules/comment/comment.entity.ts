import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@app/modules/user/user.entity';
import { PostEntity } from '@app/modules/post/post.entity';

@Entity('comments')
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '256', nullable: false })
  text: string;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.comments)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: PostEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.replies, {
    nullable: true,
  })
  @JoinColumn({ name: 'reply_to', referencedColumnName: 'id' })
  replyTo: CommentEntity | null;

  @OneToMany(() => CommentEntity, (comment) => comment.replyTo)
  replies: CommentEntity[];

  @CreateDateColumn({ name: 'created_at', type: Date, default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: Date, default: new Date() })
  updatedAt: Date;
}
