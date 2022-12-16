import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '@app/modules/user/user.entity';

@Entity('profiles')
export class ProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', type: 'varchar', length: 128, default: null })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 128, default: null })
  lastName: string;

  @Column({ name: 'photo', type: 'text', default: null })
  photo: string;

  @OneToOne(() => UserEntity, (user) => user.profile, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at', type: Date, default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: Date, default: new Date() })
  updatedAt: Date;
}
