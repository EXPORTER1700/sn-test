import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { GetCurrentUserId } from '@app/modules/auth/decorator/get-current-user-id.decorator';
import { UserService } from '@app/modules/user/user.service';
import { BaseQueryDto } from '@app/common/dto/base-query.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public getCurrentUser(@GetCurrentUserId() currentUserId: number) {
    return this.userService.getCurrentUser(currentUserId);
  }

  @Get(':username')
  public getOneByUsername(
    @Param('username') username: string,
    @GetCurrentUserId() currentUserId: number,
  ) {
    return this.userService.getOneUserByUsername(username, currentUserId);
  }

  @Post('subscribe/:username')
  public subscribeToUser(
    @Param('username') username: string,
    @GetCurrentUserId() currentUserId: number,
  ) {
    return this.userService.subscribeToUser(username, currentUserId);
  }

  @Delete('subscribe/:username')
  public unsubscribeFromUser(
    @Param('username') username: string,
    @GetCurrentUserId() currentUserId: number,
  ) {
    return this.userService.unsubscribeFromUser(username, currentUserId);
  }

  @Get('subscribers/:username')
  public getSubscribers(
    @Param('username') username: string,
    @GetCurrentUserId() currentUserId: number,
    @Query() query: BaseQueryDto,
  ) {
    return this.userService.getSubscribersByUsername(
      username,
      currentUserId,
      query,
    );
  }

  @Get('subscriptions/:username')
  public getSubscriptions(
    @Param('username') username: string,
    @GetCurrentUserId() currentUserId: number,
    @Query() query: BaseQueryDto,
  ) {
    return this.userService.getSubscriptionsByUsername(
      username,
      currentUserId,
      query,
    );
  }
}
