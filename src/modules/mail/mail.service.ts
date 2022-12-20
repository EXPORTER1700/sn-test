import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserEntity } from '@app/modules/user/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { TokenService } from '@app/modules/token/token.service';
import { UrlConfigService } from '@app/modules/custom-config/services/url-config.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: UrlConfigService,
    private readonly tokenService: TokenService,
  ) {}

  public async sendActivationList(user: UserEntity): Promise<void> {
    const token = this.tokenService.generateActivationToken({
      id: user.id,
    });

    const url = this.configService.getFrontendConfirmEmailUrl() + '/' + token;

    try {
      await this.mailerService.sendMail({
        to: user.email,
        html: `
        <h1>Follow this link to confirm your email</h1>
        <a href="${url}">Activate</a>
      `,
      });
    } catch (e) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  public async sendUpdateEmailList(userId: number, newEmail: string) {
    const token = this.tokenService.generateUpdateEmailToken(userId, newEmail);

    const url = this.configService.getFrontendConfirmEmailUrl() + '/' + token;

    try {
      await this.mailerService.sendMail({
        to: newEmail,
        html: `
        <h1>Follow this link to confirm your updated email</h1>
        <a href="${url}">Confirm</a>
      `,
      });
    } catch (e) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  public async sendResetPasswordList(email: string): Promise<void> {
    const token = this.tokenService.generateResetPasswordToken(email);
    const resetPasswordUrl = this.configService.getFrontendResetPasswordUrl();

    const url = `${resetPasswordUrl}/${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        html: `
        <h1>Follow this link to reset your password</h1>
        <a href="${url}">Reset</a>
      `,
      });
    } catch (e) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
