import { DataSource, EntityRepository, Repository } from 'typeorm';
import { ProfileEntity } from '@app/modules/profile/profile.entity';
import { UserEntity } from '@app/modules/user/user.entity';

@EntityRepository()
export class ProfileRepository extends Repository<ProfileEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ProfileEntity, dataSource.createEntityManager());
  }

  public async createProfile(user: UserEntity) {
    const profile = new ProfileEntity();
    profile.user = user;
    return await profile.save();
  }

  public async findByUserId(userId: number): Promise<ProfileEntity | null> {
    return await super.findOne({ where: { user: { id: userId } } });
  }

  public async findById(id: number): Promise<ProfileEntity | null> {
    return await this.findOne({ where: { id } });
  }
}
