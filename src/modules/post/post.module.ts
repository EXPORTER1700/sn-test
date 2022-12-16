import { forwardRef, Module } from '@nestjs/common';
import { PostController } from 'src/modules/post/post.controller';
import { PostService } from 'src/modules/post/post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '@app/modules/post/post.entity';
import { UserModule } from '@app/modules/user/user.module';
import { PostRepository } from '@app/modules/post/post.repository';
import { PostContentModule } from '@app/modules/post-content/post-content.module';
import { ProfileModule } from '@app/modules/profile/profile.module';
import { LikeModule } from '@app/modules/like/like.module';
import { SubscriptionModule } from '@app/modules/subscription/subscription.module';
import { CommentModule } from '@app/modules/comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    forwardRef(() => UserModule),
    PostContentModule,
    ProfileModule,
    LikeModule,
    SubscriptionModule,
    forwardRef(() => CommentModule),
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService],
})
export class PostModule {}
