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

  public async sandActivationList(user: UserEntity) {
    const token = this.tokenService.generateActivationToken({
      id: user.id,
      username: user.username,
    });

    const url = `http://${this.configService.get(
      'APP_HOST',
    )}:${this.configService.get('APP_PORT')}/api/auth/confirm/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      html: `
        <h1>Follow this link to confirm your email</h1>
        <a href="${url}">Activate</a>
      `,
    });
  }
}
