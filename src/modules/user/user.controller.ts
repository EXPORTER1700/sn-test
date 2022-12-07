import { Body, Controller, Put, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '@app/modules/user/user.service';
import { UpdateUserDto } from '@app/modules/user/dto/updateUser.dto';
import { GetUser } from '@app/modules/auth/decorators/getUser.decorator';
import { UserEntity } from '@app/modules/user/user.entity';
import { ProfileResponseDto } from '@app/modules/profile/dto/profileResponse.dto';
import { UpdatePasswordDto } from '@app/modules/user/dto/updatePassword.dto';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put()
  updateUser(
    @Body() dto: UpdateUserDto,
    @GetUser() currentUser: UserEntity,
  ): Promise<ProfileResponseDto> {
    return this.userService.updateUser(dto, currentUser);
  }

  @Put('password')
  updatePassword(
    @Body() dto: UpdatePasswordDto,
    @GetUser() currentUser: UserEntity,
    @Res() res: Response,
  ): Promise<void> {
    return this.userService.updatePassword(dto, currentUser, res);
  }
}
