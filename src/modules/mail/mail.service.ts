import { Injectable } from '@nestjs/common';
import { UserEntity } from '@app/modules/user/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '@app/modules/token/token.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  public async sendActivationList(user: UserEntity) {
    const token = this.tokenService.generateActivationToken({
      id: user.id,
      username: user.username,
    });

    const host = this.configService.get('APP_HOST');
    const port = this.configService.get('APP_PORT');

    const url = `http://${host}:${port}/api/auth/confirm/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      html: `
        <h1>Follow this link to confirm your email</h1>
        <a href="${url}">Activate</a>
      `,
    });
  }

  public async sendResetPasswordList(email: string): Promise<void> {
    const token = this.tokenService.generateResetPasswordToken(email);
    const frontendUrl = this.configService.get('FRONTEND_URL');

    const url = `${frontendUrl}/reset-password/${token}`;

    await this.mailerService.sendMail({
      to: email,
      html: `
        <h1>Follow this link to reset your password</h1>
        <a href="${url}">Reset</a>
      `,
    });
  }
}
