import { Injectable } from '@nestjs/common';
import { CustomConfigService } from '@app/modules/custom-config/services/custom-config.service';
import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';

@Injectable()
export class MailConfigService {
  constructor(private readonly configService: CustomConfigService) {}

  public getMailModuleConfig(): MailerOptions {
    return {
      transport: {
        host: this.configService.get<string>('MAIL_HOST'),
        secure: false,
        auth: {
          user: this.configService.get<string>('MAIL_USERNAME'),
          pass: this.configService.get<string>('MAIL_PASSWORD'),
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
        subject: 'Activate account',
      },
    };
  }
}
