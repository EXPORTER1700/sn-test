import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '@app/modules/user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('profiles')
export class ProfileEntity extends BaseEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'test' })
  @Column({ name: 'first_name', type: 'varchar', length: 128, default: null })
  firstName: string;

  @ApiProperty({ example: 'test' })
  @Column({ name: 'last_name', type: 'varchar', length: 128, default: null })
  lastName: string;

  @ApiProperty({ example: 'image/user/photo-name.jpeg' })
  @Column({ name: 'photo', type: 'text', default: null })
  photo: string;

  @Index()
  @OneToOne(() => UserEntity, (user) => user.profile, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at', type: Date, default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: Date, default: new Date() })
  updatedAt: Date;
}
