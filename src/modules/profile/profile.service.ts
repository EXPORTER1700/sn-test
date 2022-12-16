import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ProfileRepository } from '@app/modules/profile/profile.repository';
import { ProfileEntity } from '@app/modules/profile/profile.entity';
import { UserEntity } from '@app/modules/user/user.entity';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  public async createProfile(user: UserEntity): Promise<ProfileEntity> {
    return await this.profileRepository.createProfile(user);
  }

  public findByUserId(userId: number): Promise<ProfileEntity | null> {
    return this.profileRepository.findByUserId(userId);
  }

  public async findByUserIdOrThrowError(userId: number) {
    const profile = await this.findByUserId(userId);

    if (!profile) {
      throw new UnprocessableEntityException('Profile does not exist');
    }

    return profile;
  }
}
