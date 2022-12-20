import { DataSource, EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '@app/modules/user/user.entity';
import { CreateUserDto } from '@app/modules/user/dto/create-user.dto';

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

  public async findByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<UserEntity | null> {
    return await super.findOne({ where: [{ username }, { email }] });
  }

  public async findByUsername(username: string): Promise<UserEntity | null> {
    return await super.findOne({ where: { username } });
  }

  public async findById(id: number): Promise<UserEntity | null> {
    return await super.findOne({ where: { id } });
  }

  public async getUsersByIds(ids: number[]): Promise<UserEntity[]> {
    const queryBuilder = super
      .createQueryBuilder('users')
      .andWhere('users.id IN (:...ids)', { ids });

    return await queryBuilder.getMany();
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    return await super.findOne({ where: { email } });
  }
}
