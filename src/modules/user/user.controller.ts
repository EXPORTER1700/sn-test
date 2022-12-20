import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUserId } from '@app/modules/auth/decorator/get-current-user-id.decorator';
import { UserService } from '@app/modules/user/user.service';
import { BaseQueryDto } from '@app/common/dto/base-query.dto';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from '@app/modules/user/dto/user-response.dto';
import { SuccessResponseDto } from '@app/common/dto/success-response.dto';
import { UserPreviewDto } from '@app/modules/user/dto/user-preview.dto';
import { LocalAuthGuard } from '@app/modules/auth/guard/auth.guard';
import { UnprocessableErrorApiResponseDto } from '@app/common/swagger-api-response/dto/unprocessable-error-api-response.dto';
import { UnauthorizedErrorApiResponseDto } from '@app/common/swagger-api-response/dto/unauthorized-error-api-response.dto';
import { UpdateUsernameDto } from '@app/modules/user/dto/update-username.dto';
import { UpdateEmailDto } from '@app/modules/user/dto/update-email.dto';

@Controller('user')
@ApiTags('user')
@ApiCookieAuth()
@ApiUnauthorizedResponse({
  type: UnauthorizedErrorApiResponseDto,
  description: 'Unauthorized',
})
@UseGuards(LocalAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ type: UserResponseDto, description: 'Return current user' })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist',
  })
  public getCurrentUser(
    @GetCurrentUserId() currentUserId: number,
  ): Promise<UserResponseDto> {
    return this.userService.getCurrentUser(currentUserId);
  }

  @Get(':username')
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'Return user by username',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist',
  })
  public getOneByUsername(
    @Param('username') username: string,
    @GetCurrentUserId() currentUserId: number,
  ): Promise<UserResponseDto> {
    return this.userService.getOneUserByUsername(username, currentUserId);
  }

  @Post('subscribe/:username')
  @ApiCreatedResponse({ type: SuccessResponseDto, description: 'Success' })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist',
  })
  public subscribeToUser(
    @Param('username') username: string,
    @GetCurrentUserId() currentUserId: number,
  ): Promise<SuccessResponseDto> {
    return this.userService.subscribeToUser(username, currentUserId);
  }

  @Delete('subscribe/:username')
  @ApiOkResponse({ type: SuccessResponseDto, description: 'Success' })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist',
  })
  public unsubscribeFromUser(
    @Param('username') username: string,
    @GetCurrentUserId() currentUserId: number,
  ): Promise<SuccessResponseDto> {
    return this.userService.unsubscribeFromUser(username, currentUserId);
  }

  @Get('subscribers/:username')
  @ApiOkResponse({
    type: [UserPreviewDto],
    description: 'Return users preview list',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist',
  })
  public getSubscribers(
    @Param('username') username: string,
    @GetCurrentUserId() currentUserId: number,
    @Query() query: BaseQueryDto,
  ): Promise<UserPreviewDto[]> {
    return this.userService.getSubscribersByUsername(
      username,
      currentUserId,
      query,
    );
  }

  @Get('subscriptions/:username')
  @ApiOkResponse({
    type: [UserPreviewDto],
    description: 'Return users preview list',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist',
  })
  public getSubscriptions(
    @Param('username') username: string,
    @GetCurrentUserId() currentUserId: number,
    @Query() query: BaseQueryDto,
  ): Promise<UserPreviewDto[]> {
    return this.userService.getSubscriptionsByUsername(
      username,
      currentUserId,
      query,
    );
  }

  @Put('username')
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'Username was successfully update',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist or new username is already taken',
  })
  public updateUsername(
    @GetCurrentUserId() currentUserId: number,
    @Body() dto: UpdateUsernameDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUsername(currentUserId, dto);
  }

  @Put('email')
  @ApiCreatedResponse({
    type: SuccessResponseDto,
    description: 'Send list to new email',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist or password is not valid',
  })
  public updateEmail(
    @GetCurrentUserId() currentUserId: number,
    @Body() dto: UpdateEmailDto,
  ): Promise<SuccessResponseDto> {
    return this.userService.updateEmail(currentUserId, dto);
  }

  @Get('confirm-updated-email/:token')
  @ApiOkResponse({
    type: SuccessResponseDto,
    description: 'Email is successfully confirmed',
  })
  @ApiUnprocessableEntityResponse({
    type: UnprocessableErrorApiResponseDto,
    description: 'User does not exist or email is already taken',
  })
  public confirmUpdatedEmail(
    @Param('token') token: string,
  ): Promise<SuccessResponseDto> {
    return this.userService.confirmUpdatedEmail(token);
  }
}
