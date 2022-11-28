import { Module } from '@nestjs/common';
import { AuthController } from '@app/modules/auth/auth.controller';
import { AuthService } from '@app/modules/auth/auth.service';
import { UserModule } from '@app/modules/user/user.module';
import { MailModule } from '@app/modules/mail/mail.module';
import { TokenModule } from '@app/modules/token/token.module';
import { RedisModule } from '@app/modules/redis/redis.module';

@Module({
  imports: [UserModule, MailModule, TokenModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
