import { DataSource, EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '@app/modules/user/user.entity';
import { CreateUserDto } from '@app/modules/user/dto/createUser.dto';

@EntityRepository()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  public async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const user = new UserEntity();
    Object.assign(user, dto);

    return await user.save();
  }
}
