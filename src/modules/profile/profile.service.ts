import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '@app/modules/profile/profile.repository';
import { UserEntity } from '@app/modules/user/user.entity';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  public async createProfile(user: UserEntity) {
    return await this.profileRepository.createProfile(user);
  }
}
