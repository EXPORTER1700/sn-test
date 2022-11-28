import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserStatusEnum } from '@app/modules/user/types/userStatus.enum';
import { ProfileEntity } from '@app/modules/profile/profile.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
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

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => ProfileEntity, (profile) => profile.user)
  profile: ProfileEntity;
}
