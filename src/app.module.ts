import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './modules/mail/mail.module';
import { TokenModule } from './modules/token/token.module';
import { FileModule } from '@app/modules/file/file.module';
import { CustomConfigModule } from '@app/modules/custom-config/custom-config.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { DbConfigService } from '@app/modules/custom-config/services/db-config.service';
import { JwtConfigService } from '@app/modules/custom-config/services/jwt-config.service';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { PostContentModule } from './modules/post-content/post-content.module';
import { LikeModule } from './modules/like/like.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [DbConfigService],
      useFactory: (configService: DbConfigService) =>
        configService.getDbConnection(),
    }),
    {
      ...JwtModule.registerAsync({
        imports: [CustomConfigModule],
        inject: [JwtConfigService],
        useFactory: (configService: JwtConfigService) =>
          configService.getJwtModuleConfig(),
      }),
      global: true,
    },
    MailModule,
    TokenModule,
    FileModule,
    CustomConfigModule,
    UserModule,
    ProfileModule,
    AuthModule,
    PostModule,
    PostContentModule,
    LikeModule,
    SubscriptionModule,
    CommentModule,
  ],
  controllers: [],
  providers: [JwtService],
})
export class AppModule {}
