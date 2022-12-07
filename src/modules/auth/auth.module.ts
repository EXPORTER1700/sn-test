import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from '@app/modules/auth/auth.controller';
import { AuthService } from '@app/modules/auth/auth.service';
import { UserModule } from '@app/modules/user/user.module';
import { MailModule } from '@app/modules/mail/mail.module';
import { TokenModule } from '@app/modules/token/token.module';
import { RedisSessionModule } from '@app/modules/redis-session/redis-session.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MailModule,
    TokenModule,
    RedisSessionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
