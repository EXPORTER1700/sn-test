import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from '@app/modules/profile/profile.service';
import { GetUser } from '@app/modules/auth/decorators/getUser.decorator';
import { UserEntity } from '@app/modules/user/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ProfileResponseDto } from '@app/modules/profile/dto/profileResponse.dto';
import { SearchProfilesQueryInterface } from '@app/modules/profile/types/searchProfilesQuery.interface';
import { ProfilePreviewDto } from '@app/modules/profile/dto/profilePreview.dto';
import { UpdateProfileDto } from '@app/modules/profile/dto/updateProfile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilePhotoValidationPipe } from '@app/modules/profile/pipes/profilePhotoValidation.pipe';

@Controller('profile')
@UseGuards(AuthGuard())
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  public getMe(@GetUser() user: UserEntity): Promise<ProfileResponseDto> {
    return this.profileService.getMe(user);
  }

  @Get(':username')
  public getProfileByUsername(
    @Param('username') username: string,
    @GetUser() user: UserEntity,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getProfileByUsername(username, user);
  }

  @Post('subscribe/:username')
  public subscribe(
    @Param('username') username: string,
    @GetUser() user: UserEntity,
  ) {
    return this.profileService.subscribe(user.id, username);
  }

  @Delete('subscribe/:username')
  public unsubscribe(
    @Param('username') username: string,
    @GetUser() user: UserEntity,
  ) {
    return this.profileService.unsubscribe(user.id, username);
  }

  @Get('search/:username')
  public searchProfilesByUsername(
    @Param('username') username: string,
    @Query() query: SearchProfilesQueryInterface,
  ): Promise<ProfilePreviewDto[]> {
    return this.profileService.searchProfilesByUsername(username, query);
  }

  @Put()
  @UseInterceptors(FileInterceptor('photo'))
  updateProfile(
    @Body() dto: UpdateProfileDto,
    @UploadedFile(ProfilePhotoValidationPipe)
    photo: Express.Multer.File | undefined,
    @GetUser() currentUser: UserEntity,
  ): Promise<ProfileResponseDto> {
    return this.profileService.updateProfile(dto, photo, currentUser);
  }
}
