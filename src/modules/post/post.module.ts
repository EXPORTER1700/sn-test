import { forwardRef, Module } from '@nestjs/common';
import { PostService } from 'src/modules/post/post.service';
import { PostController } from 'src/modules/post/post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '@app/modules/post/post.entity';
import { PostRepository } from '@app/modules/post/post.repository';
import { PostContentModule } from '@app/modules/post-content/postContent.module';
import { UserModule } from '@app/modules/user/user.module';
import { CommentModule } from '@app/modules/comment/comment.module';
import { ProfileModule } from '@app/modules/profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    PostContentModule,
    forwardRef(() => UserModule),
    forwardRef(() => CommentModule),
    forwardRef(() => ProfileModule),
  ],
  providers: [PostService, PostRepository],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
