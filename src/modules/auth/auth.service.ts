import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenService } from '@app/modules/token/token.service';
import { CreateUserDto } from '@app/modules/user/dto/createUser.dto';
import { UserService } from '@app/modules/user/user.service';
import { MailService } from '@app/modules/mail/mail.service';
import { UserStatusEnum } from '@app/modules/user/types/userStatus.enum';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from '@app/modules/auth/dto/loginUser.dto';
import * as bcrypt from 'bcrypt';
import { RedisService } from '@app/modules/redis/redis.service';
import { TokenPayloadInterface } from '@app/modules/token/types/tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  public async registration(dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);

    await this.mailService.sandActivationList(user);

    return;
  }

  public async confirmEmail(token: string, res: Response) {
    const payload = this.tokenService.verifyToken(token);

    const user = await this.userService.findById(payload.id);
    user.status = UserStatusEnum.ACTIVATED;
    await user.save();

    return res.redirect(this.configService.get('FRONTEND_URL'));
  }

  public async login(dto: LoginUserDto, res: Response): Promise<void> {
    const user = await this.userService.findByUsername(dto.username);

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
    await this.redisService.del(String(userId));
  }

  public async refresh(refreshToken: string, res: Response): Promise<void> {
    const tokenPayload = await this.tokenService.verifyToken(refreshToken);

    if (!tokenPayload) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const tokenFromCache = await this.redisService.get(String(tokenPayload.id));

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

    await this.redisService.set(String(payload.id), refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.send({ accessToken });
  }
}
