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
import { PostContentEntity } from '@app/modules/post-content/post-content.entity';
import { Exclude } from 'class-transformer';
import { LikeEntity } from '@app/modules/like/like.entity';
import { CommentEntity } from '@app/modules/comment/comment.entity';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 512, nullable: false })
  title: string;

  @Column({ type: 'int', nullable: false, default: 0, name: 'like_count' })
  likeCount: number;

  @Column({ type: 'int', nullable: false, default: 0, name: 'comment_count' })
  commentCount: string;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @Exclude({ toPlainOnly: true })
  user: UserEntity;

  @OneToMany(() => PostContentEntity, (postContent) => postContent.post)
  content: PostContentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.post)
  likes: LikeEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];

  @CreateDateColumn({ name: 'created_at', type: Date, default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: Date, default: new Date() })
  updatedAt: Date;
}
