import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '@app/modules/user/user.entity';

@Entity('profiles')
export class ProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  photo: string;

  @OneToOne(() => UserEntity, (user) => user.profile)
  @JoinColumn()
  user: UserEntity;
}
