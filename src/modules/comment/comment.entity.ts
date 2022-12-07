import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '@app/modules/user/user.entity';
import { PostEntity } from '@app/modules/post/post.entity';

@Entity('comments')
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.comments, { eager: true })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.comments)
  post: PostEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.replyTo)
  replies: CommentEntity[];

  @ManyToOne(() => CommentEntity, (comment) => comment.replies)
  replyTo: CommentEntity | null;
}
