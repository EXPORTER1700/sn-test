import { forwardRef, Module } from '@nestjs/common';
import { CommentController } from 'src/modules/comment/comment.controller';
import { CommentService } from 'src/modules/comment/comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '@app/modules/comment/comment.entity';
import { CommentRepository } from '@app/modules/comment/comment.repository';
import { UserModule } from '@app/modules/user/user.module';
import { PostModule } from '@app/modules/post/post.module';
import { ProfileModule } from '@app/modules/profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => PostModule),
    ProfileModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  exports: [CommentService],
})
export class CommentModule {}
