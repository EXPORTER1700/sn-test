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
import { PostContentEntity } from '@app/modules/post-content/postContent.entity';
import { CommentEntity } from '@app/modules/comment/comment.entity';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  user: UserEntity;

  @OneToMany(() => PostContentEntity, (postContent) => postContent.post)
  content: PostContentEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];

  @Column({ default: 0 })
  likeCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
