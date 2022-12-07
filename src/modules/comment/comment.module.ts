import { forwardRef, Module } from '@nestjs/common';
import { CommentController } from '@app/modules/comment/comment.controller';
import { CommentService } from '@app/modules/comment/comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '@app/modules/comment/comment.entity';
import { CommentRepository } from '@app/modules/comment/comment.repository';
import { PostModule } from '@app/modules/post/post.module';
import { UserModule } from '@app/modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    forwardRef(() => PostModule),
    forwardRef(() => UserModule),
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  exports: [CommentService],
})
export class CommentModule {}
