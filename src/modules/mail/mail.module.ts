import { Module } from '@nestjs/common';
import { MailService } from 'src/modules/mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenModule } from '@app/modules/token/token.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get('MAIL_USERNAME'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
          subject: 'Activate account',
        },
      }),
    }),
    TokenModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
