import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostContentTypesEnum } from '@app/modules/post-content/types/postContentTypes.enum';
import { PostEntity } from '@app/modules/post/post.entity';

@Entity('post_contents')
export class PostContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ type: 'enum', enum: PostContentTypesEnum })
  type: PostContentTypesEnum;

  @ManyToOne(() => PostEntity, (post) => post.content)
  post: PostEntity;
}
