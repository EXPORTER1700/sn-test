import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostContentTypeEnum } from '@app/modules/post-content/types/post-content-type.enum';
import { PostEntity } from '@app/modules/post/post.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('post_contents')
export class PostContentEntity extends BaseEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'image' })
  @Column({ type: 'enum', enum: PostContentTypeEnum })
  type: PostContentTypeEnum;

  @ApiProperty({ example: 'image/post/photo-path.jpeg' })
  @Column({ type: 'text', nullable: false })
  url: string;

  @ManyToOne(() => PostEntity, (post) => post.content)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  @Exclude({ toPlainOnly: true })
  post: PostEntity;

  @CreateDateColumn({ name: 'created_at', type: Date, default: new Date() })
  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: Date, default: new Date() })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;
}
