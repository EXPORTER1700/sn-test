import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '@app/modules/user/dto/create-user.dto';
import { AuthService } from '@app/modules/auth/auth.service';
import { SuccessResponseDto } from '@app/common/dto/success-response.dto';
import { LoginWithCredentialsGuard } from '@app/modules/auth/guard/login-with-credentials.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  public registration(@Body() dto: CreateUserDto): Promise<SuccessResponseDto> {
    return this.authService.registration(dto);
  }

  @Get('confirm-email/:token')
  public confirmEmail(
    @Param('token') token: string,
  ): Promise<SuccessResponseDto> {
    return this.authService.confirmEmail(token);
  }

  @Post('login')
  @UseGuards(LoginWithCredentialsGuard)
  public login(): SuccessResponseDto {
    return new SuccessResponseDto();
  }
}
