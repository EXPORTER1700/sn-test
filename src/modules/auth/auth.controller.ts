import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { CreateUserDto } from '@app/modules/user/dto/createUser.dto';
import { AuthService } from '@app/modules/auth/auth.service';
import { LoginUserDto } from '@app/modules/auth/dto/loginUser.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  registration(@Body() dto: CreateUserDto) {
    return this.authService.registration(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto, @Res() res: Response): Promise<void> {
    return await this.authService.login(dto, res);
  }

  @Get('confirm/:token')
  confirmEmail(
    @Param('token') token: string,
    @Res() res: Response,
  ): Promise<void> {
    return this.authService.confirmEmail(token, res);
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response): Promise<void> {
    return await this.authService.refresh(req.cookies?.refreshToken, res);
  }
}
