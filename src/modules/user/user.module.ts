import { forwardRef, Module } from '@nestjs/common';
import { UserController } from 'src/modules/user/user.controller';
import { UserService } from 'src/modules/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/modules/user/user.entity';
import { UserRepository } from '@app/modules/user/user.repository';
import { ProfileModule } from '@app/modules/profile/profile.module';
import { PostModule } from '@app/modules/post/post.module';
import { SubscriptionModule } from '@app/modules/subscription/subscription.module';
import { MailModule } from '@app/modules/mail/mail.module';
import { TokenModule } from '@app/modules/token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ProfileModule,
    forwardRef(() => PostModule),
    SubscriptionModule,
    MailModule,
    TokenModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
