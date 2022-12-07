import { Module } from '@nestjs/common';
import { PostContentService } from '@app/modules/post-content/postContent.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostContentEntity } from '@app/modules/post-content/postContent.entity';
import { PostContentRepository } from '@app/modules/post-content/postContent.repository';
import { FileModule } from '@app/modules/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostContentEntity]), FileModule],
  providers: [PostContentService, PostContentRepository],
  exports: [PostContentService],
})
export class PostContentModule {}
