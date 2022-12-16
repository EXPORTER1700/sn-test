import { Module } from '@nestjs/common';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserModule } from '@app/modules/user/user.module';
import { MailModule } from '@app/modules/mail/mail.module';
import { TokenModule } from '@app/modules/token/token.module';
import { LocalSerializer } from '@app/modules/auth/local.serializer';
import { LocalStrategy } from '@app/modules/auth/local.strategy';

@Module({
  imports: [UserModule, MailModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, LocalSerializer, LocalStrategy],
})
export class AuthModule {}
