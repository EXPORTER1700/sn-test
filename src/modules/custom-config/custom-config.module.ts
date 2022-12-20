import { Global, Module } from '@nestjs/common';
import { CustomConfigService } from '@app/modules/custom-config/services/custom-config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbConfigService } from '@app/modules/custom-config/services/db-config.service';
import { PassportConfigService } from '@app/modules/custom-config/services/passport-config.service';
import { JwtConfigService } from '@app/modules/custom-config/services/jwt-config.service';
import { MailConfigService } from '@app/modules/custom-config/services/mail-config.service';
import { S3ConfigService } from '@app/modules/custom-config/services/s3-config.service';
import { UrlConfigService } from '@app/modules/custom-config/services/url-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
  ],
  providers: [
    CustomConfigService,
    ConfigService,
    DbConfigService,
    PassportConfigService,
    JwtConfigService,
    MailConfigService,
    S3ConfigService,
    UrlConfigService,
  ],
  exports: [
    CustomConfigService,
    DbConfigService,
    PassportConfigService,
    JwtConfigService,
    MailConfigService,
    S3ConfigService,
    UrlConfigService,
  ],
})
export class CustomConfigModule {}
