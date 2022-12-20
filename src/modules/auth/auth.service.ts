import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '@app/modules/user/user.service';
import { CreateUserDto } from '@app/modules/user/dto/create-user.dto';
import { MailService } from '@app/modules/mail/mail.service';
import { TokenService } from '@app/modules/token/token.service';
import { SuccessResponseDto } from '@app/common/dto/success-response.dto';
import { UserStatusEnum } from '@app/modules/user/types/user-status.enum';
import { UserEntity } from '@app/modules/user/user.entity';
import { ResetPasswordDto } from '@app/modules/user/dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ) {}

  public async registration(dto: CreateUserDto): Promise<SuccessResponseDto> {
    const user = await this.userService.createUser(dto);
    await this.mailService.sendActivationList(user);

    return new SuccessResponseDto();
  }

  public async confirmEmail(token: string): Promise<SuccessResponseDto> {
    const { id } = this.tokenService.verifyActivationToken(token);
    await this.userService.activateUser(id);

    return new SuccessResponseDto();
  }

  public async login(username: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findByUsernameOrThrowError(username);

    const isPasswordValid = await this.userService.checkPassword(
      password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnprocessableEntityException('User does not exist');

    if (user.status === UserStatusEnum.NOT_CONFIRMED)
      throw new ForbiddenException('Email is not confirmed');

    if (user.status === UserStatusEnum.BANNED)
      throw new ForbiddenException('User is banned');

    return user;
  }

  public async logout(req: Request): Promise<SuccessResponseDto> {
    req.logout((e) => {
      throw new InternalServerErrorException('Internal server error');
    });

    if (req.isAuthenticated()) {
      throw new InternalServerErrorException('Internal server error');
    }

    return new SuccessResponseDto();
  }

  public async forgotPassword(email: string): Promise<SuccessResponseDto> {
    await this.userService.findByEmailOrThrowError(email);
    await this.mailService.sendResetPasswordList(email);

    return new SuccessResponseDto();
  }

  public async resetPassword(
    token: string,
    dto: ResetPasswordDto,
  ): Promise<SuccessResponseDto> {
    const { email } = this.tokenService.verifyResetPasswordToken(token);
    await this.userService.resetPassword(email, dto);

    return new SuccessResponseDto();
  }
}
