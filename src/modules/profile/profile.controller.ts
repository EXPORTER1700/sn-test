import {
  Body,
  Controller,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetCurrentUserId } from '@app/modules/auth/decorator/get-current-user-id.decorator';
import { UpdateProfileDto } from '@app/modules/profile/dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from '@app/modules/profile/profile.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ProfileEntity } from '@app/modules/profile/profile.entity';
import { UnprocessableErrorApiResponseDto } from '@app/common/swagger-api-response/dto/unprocessable-error-api-response.dto';
import { BadRequestErrorApiResponseDto } from '@app/common/swagger-api-response/dto/bad-request-error-api-response.dto';
import { LocalAuthGuard } from '@app/modules/auth/guard/auth.guard';

@Controller('profile')
@ApiTags('profile')
@UseGuards(LocalAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put()
  @ApiCreatedResponse({
    type: ProfileEntity,
    description: 'Profile was successfully update',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'Profile does not exist',
  })
  @ApiBadRequestResponse({
    type: BadRequestErrorApiResponseDto,
    description: 'Not valid dto',
  })
  @UseInterceptors(FileInterceptor('file'))
  public updateProfile(
    @GetCurrentUserId() currentUserId: number,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<ProfileEntity> {
    return this.profileService.updateProfile(currentUserId, dto, file);
  }
}
