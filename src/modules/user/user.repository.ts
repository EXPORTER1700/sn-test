import { HttpException, HttpStatus } from '@nestjs/common';
import { DataSource, EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '@app/modules/user/user.entity';
import { CreateUserDto } from '@app/modules/user/dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@EntityRepository()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  public async createUser(dto: CreateUserDto) {
    const user = new UserEntity();
    Object.assign(user, dto);
    user.password = await bcrypt.hash(dto.password, 10);

    try {
      return await user.save();
    } catch (e) {
      if (e.code === '23505') {
        throw new HttpException(
          'User is already exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
