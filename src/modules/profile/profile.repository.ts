import { DataSource, EntityRepository, Repository } from 'typeorm';
import { ProfileEntity } from '@app/modules/profile/profile.entity';
import { UserEntity } from '@app/modules/user/user.entity';

@EntityRepository()
export class ProfileRepository extends Repository<ProfileRepository> {
  constructor(private readonly dataSource: DataSource) {
    super(ProfileEntity, dataSource.createEntityManager());
  }

  public async createProfile(user: UserEntity): Promise<ProfileEntity> {
    const profile = new ProfileEntity();
    profile.user = user;
    return await profile.save();
  }
}
