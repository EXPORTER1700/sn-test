import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from '@app/modules/user/dto/createUser.dto';
import { AuthService } from '@app/modules/auth/auth.service';
import { LoginUserDto } from '@app/modules/auth/dto/loginUser.dto';
import { ResetPasswordDto } from '@app/modules/auth/dto/resetPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  public registration(@Body() dto: CreateUserDto) {
    return this.authService.registration(dto);
  }

  @Post('login')
  public login(@Body() dto: LoginUserDto, @Res() res: Response): Promise<void> {
    return this.authService.login(dto, res);
  }

  @Get('confirm/:token')
  public confirmEmail(
    @Param('token') token: string,
    @Res() res: Response,
  ): Promise<void> {
    return this.authService.confirmEmail(token, res);
  }

  @Get('refresh')
  public refresh(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.authService.refresh(req.cookies?.refreshToken, res);
  }

  @Get('forgot-password/:email')
  public forgotPassword(@Param('email') email: string) {
    return this.authService.sendResetPasswordList(email);
  }

  @Put('reset-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() dto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    return this.authService.resetPassword(dto, token, res);
  }
}
