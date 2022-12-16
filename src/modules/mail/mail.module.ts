import { Module } from '@nestjs/common';
import { MailService } from 'src/modules/mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { TokenModule } from '@app/modules/token/token.module';
import { CustomConfigModule } from '@app/modules/custom-config/custom-config.module';
import { MailConfigService } from '@app/modules/custom-config/services/mail-config.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [MailConfigService],
      useFactory: (configService: MailConfigService) =>
        configService.getMailModuleConfig(),
    }),
    TokenModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
