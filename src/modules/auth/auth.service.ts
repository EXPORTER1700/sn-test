import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TokenService } from '@app/modules/token/token.service';
import { CreateUserDto } from '@app/modules/user/dto/createUser.dto';
import { UserService } from '@app/modules/user/user.service';
import { MailService } from '@app/modules/mail/mail.service';
import { UserStatusEnum } from '@app/modules/user/types/userStatus.enum';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from '@app/modules/auth/dto/loginUser.dto';
import * as bcrypt from 'bcrypt';
import { RedisSessionService } from '@app/modules/redis-session/redis-session.service';
import { TokenPayloadInterface } from '@app/modules/token/types/tokenPayload.interface';
import { ResetPasswordDto } from '@app/modules/auth/dto/resetPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisSessionService,
  ) {}

  public async registration(dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);

    await this.mailService.sendActivationList(user);

    return;
  }

  public async confirmEmail(token: string, res: Response) {
    const payload = this.tokenService.verifyToken(token);

    const user = await this.userService.findByIdWithRelations(payload.id);

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    user.status = UserStatusEnum.ACTIVATED;
    await user.save();

    return res.redirect(this.configService.get('FRONTEND_URL') as string);
  }

  public async login(dto: LoginUserDto, res: Response): Promise<void> {
    const user = await this.userService.findByUsernameWithRelations(
      dto.username,
    );

    if (!user) {
      throw new HttpException(
        'User does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user.status === UserStatusEnum.BANNED) {
      throw new HttpException('User is banned', HttpStatus.FORBIDDEN);
    }

    if (user.status === UserStatusEnum.NOT_CONFIRMED) {
      throw new HttpException('Email does not activate', HttpStatus.FORBIDDEN);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new HttpException(
        'User does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.sendTokens({ id: user.id, username: user.username }, res);
  }

  public async logout(userId: number) {
    await this.redisService.delete(userId);
  }

  public async sendResetPasswordList(email: string): Promise<void> {
    const userByEmail = await this.userService.findByEmail(email);

    if (!userByEmail) {
      throw new UnprocessableEntityException(
        'User with this email does not exist',
      );
    }

    await this.mailService.sendResetPasswordList(email);
  }

  public async resetPassword(
    dto: ResetPasswordDto,
    token: string,
    res: Response,
  ) {
    const tokenPayload = this.tokenService.verifyResetPasswordToken(token);

    await this.userService.resetPassword(dto, tokenPayload.email);

    return res.redirect(this.configService.get('FRONTEND_URL') + 'login');
  }

  public async refresh(refreshToken: string, res: Response): Promise<void> {
    const tokenPayload = await this.tokenService.verifyToken(refreshToken);

    if (!tokenPayload) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const tokenFromCache = await this.redisService.get(tokenPayload.id);

    if (!tokenFromCache || tokenFromCache !== refreshToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    await this.sendTokens(
      { id: tokenPayload.id, username: tokenPayload.username },
      res,
    );
  }

  private async sendTokens(
    payload: TokenPayloadInterface,
    res: Response,
  ): Promise<Response> {
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    await this.redisService.set(payload.id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.send({ accessToken });
  }
}
