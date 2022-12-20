import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ProfileRepository } from '@app/modules/profile/profile.repository';
import { ProfileEntity } from '@app/modules/profile/profile.entity';
import { UserEntity } from '@app/modules/user/user.entity';
import { UpdateProfileDto } from '@app/modules/profile/dto/update-profile.dto';
import { FileService } from '@app/modules/file/file.service';
import { UploadFileContentTypeEnum } from '@app/modules/file/types/upload-file-content-type.enum';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly fileService: FileService,
  ) {}

  public async createProfile(user: UserEntity): Promise<ProfileEntity> {
    return await this.profileRepository.createProfile(user);
  }

  public async updateProfile(
    currentUserId: number,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ): Promise<ProfileEntity> {
    const profile = await this.findByUserIdOrThrowError(currentUserId);
    Object.assign(profile, dto);

    if (file) {
      const uploadResponse = await this.fileService.uploadFile(
        file,
        UploadFileContentTypeEnum.USER,
      );

      profile.photo = uploadResponse.Location;
    }

    return await profile.save();
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

  public async findById(id: number): Promise<ProfileEntity | null> {
    return await this.profileRepository.findById(id);
  }

  public async findByIdOrThrowError(id: number): Promise<ProfileEntity> {
    const profile = await this.findById(id);

    if (!profile) {
      throw new UnprocessableEntityException('Profile does not exist');
    }

    return profile;
  }
}
