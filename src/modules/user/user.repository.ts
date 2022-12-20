import { DataSource, EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '@app/modules/user/user.entity';
import { CreateUserDto } from '@app/modules/user/dto/create-user.dto';
import { UserStatusEnum } from '@app/modules/user/types/user-status.enum';
import { getDateAgo } from '@app/common/utils/get-date-ago.util';
import { numberOfDaysAfterUserDeleteIfNotConfirmedConstant } from '@app/modules/user/types/number-of-days-after-user-delete-if-not-confirmed.constant';

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

  public async getUsersWhoAreNotActivatedForDefaultNumberOfDays() {
    const date = getDateAgo(
      new Date(),
      numberOfDaysAfterUserDeleteIfNotConfirmedConstant,
    );

    const queryBuilder = super
      .createQueryBuilder('users')
      .andWhere('users.status = :status', {
        status: UserStatusEnum.NOT_CONFIRMED,
      })
      .andWhere('users.createdAt < :date', { date });

    return await queryBuilder.getMany();
  }
}
