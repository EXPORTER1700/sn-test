import { Injectable } from '@nestjs/common';
import { UserRepository } from '@app/modules/user/user.repository';
import { CreateUserDto } from '@app/modules/user/dto/createUser.dto';
import { UserEntity } from '@app/modules/user/user.entity';
import { ProfileService } from '@app/modules/profile/profile.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileService: ProfileService,
  ) {}

  public async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.createUser(dto);

    await this.profileService.createProfile(user);

    return user;
  }

  public async findById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id } });
  }

  public async findByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }
}
